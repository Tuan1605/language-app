import { useEffect, useRef, useCallback } from "react";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";

// ─── Types ───
export interface BattleEntity {
  name: string;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  state: "idle" | "attack" | "hurt" | "dead";
  isPlayer: boolean;
  scale?: number;
}

export interface ParticleEffect {
  type: "fire" | "ice" | "thunder" | "heal" | "poison" | "shield" | "crit";
  x: number;
  y: number;
  timestamp: number;
}

export interface DamagePopup {
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
  isHeal: boolean;
  timestamp: number;
}

interface PixiBattleProps {
  width: number;
  height: number;
  player: BattleEntity;
  enemy: BattleEntity;
  effects: ParticleEffect[];
  damagePopups: DamagePopup[];
  combo: number;
}

// ─── Asset Map ───
const ASSETS: Record<string, string> = {
  bg: "/assets/rpg/battle_bg.png",
  hero: "/assets/rpg/hero.png",
  Slime: "/assets/rpg/slime.png",
  Bat: "/assets/rpg/bat.png",
  Goblin: "/assets/rpg/goblin.png",
  Skeleton: "/assets/rpg/skeleton.png",
  "Dark Knight": "/assets/rpg/knight.png",
  "Demon Lord": "/assets/rpg/demon.png",
  Dragon: "/assets/rpg/dragon.png"
};

// ─── Chroma Key Shader (smooth edge removal of green background) ───
const chromaShader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 keyColor;
uniform float similarity;
uniform float smoothness;
uniform float spill;
void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float d = distance(color.rgb, keyColor);
    float edge = smoothstep(similarity, similarity + smoothness, d);
    float spillVal = max(0.0, color.g - max(color.r, color.b)) * spill;
    color.rgb -= vec3(spillVal * (1.0 - edge));
    gl_FragColor = vec4(color.rgb, color.a * edge);
}
`;
const chromaFilter = new PIXI.Filter(undefined, chromaShader, {
  keyColor: [0.0, 1.0, 0.0],
  similarity: 0.35,
  smoothness: 0.15,
  spill: 0.5
});

// ─── Drawing Helpers ───
function drawRoundedRect(graphics: PIXI.Graphics, x: number, y: number, w: number, h: number, r: number, color: number, alpha = 1) {
  graphics.beginFill(color, alpha);
  graphics.drawRoundedRect(x, y, w, h, r);
  graphics.endFill();
}

function drawHpBar(container: PIXI.Container, x: number, y: number, w: number, h: number, current: number, max: number) {
  const bar = new PIXI.Graphics();
  const pct = Math.max(0, current / max);
  drawRoundedRect(bar, x, y, w, h, 4, 0x4A5568);
  const fillColor = pct > 0.5 ? 0x48BB78 : pct > 0.25 ? 0xED8936 : 0xF56565;
  drawRoundedRect(bar, x, y, w * pct, h, 4, fillColor);
  bar.beginFill(0xFFFFFF, 0.3);
  bar.drawRoundedRect(x, y, w * pct, h / 2, 4);
  bar.endFill();
  container.addChild(bar);
  return bar;
}

function createParticle(container: PIXI.Container, x: number, y: number, type: string) {
  const g = new PIXI.Graphics();
  const count = type === "thunder" ? 12 : type === "fire" ? 10 : 8;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist = 20 + Math.random() * 30;
    const size = 3 + Math.random() * 4; // slightly bigger for retro feel
    let color: number;
    switch (type) {
      case "fire": color = i % 2 === 0 ? 0xF56565 : 0xFBBF24; break;
      case "ice": color = i % 2 === 0 ? 0x63B3ED : 0xE0F2FE; break;
      case "thunder": color = i % 3 === 0 ? 0xFBBF24 : i % 3 === 1 ? 0xFFF5F5 : 0xFED7D7; break;
      case "heal": color = 0x48BB78; break;
      case "poison": color = 0x9B2C2C; break;
      default: color = 0xFBBF24;
    }
    // Draw square particles for retro style
    g.beginFill(color, 0.8);
    g.drawRect(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, size, size);
    g.endFill();
  }
  container.addChild(g);
  return g;
}

function createDamagePopup(container: PIXI.Container, value: number, x: number, y: number, isCrit: boolean, isHeal: boolean) {
  const text = new PIXI.Text(
    isHeal ? `+${value}` : `${isCrit ? "💥" : ""}-${value}`,
    {
      fontFamily: "Courier New, monospace",
      fontSize: isCrit ? 36 : 28,
      fontWeight: "900",
      fill: isHeal ? 0x48BB78 : isCrit ? 0xED8936 : 0xF56565,
      stroke: 0x000000,
      strokeThickness: 5,
    }
  );
  text.anchor.set(0.5);
  text.x = x;
  text.y = y;
  container.addChild(text);
  return text;
}

// ─── Main Component ───
export function PixiBattle({ width, height, player, enemy, effects, damagePopups, combo }: PixiBattleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const destroyedRef = useRef(false);
  
  const spritesRef = useRef<{ playerSprite?: PIXI.Sprite, enemySprite?: PIXI.Sprite }>({});
  const effectsContainerRef = useRef<PIXI.Container | null>(null);
  const uiContainerRef = useRef<PIXI.Container | null>(null);
  const frameRef = useRef(0);

  const safeRemoveChildren = useCallback((container: PIXI.Container | null) => {
    if (!container || destroyedRef.current) return;
    try { container.removeChildren(); } catch (e) { void e; }
  }, []);

  useEffect(() => {
    destroyedRef.current = false;
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x1A202C,
      antialias: false, // Turn off antialias for crisp pixels
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    if (!containerRef.current || destroyedRef.current) {
      app.destroy(true);
      return;
    }

    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Set nearest neighbor scaling globally for retro look
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const bgContainer = new PIXI.Container();
    const characterContainer = new PIXI.Container();
    const effectsContainer = new PIXI.Container();
    const uiContainer = new PIXI.Container();

    app.stage.addChild(bgContainer);
    app.stage.addChild(characterContainer);
    app.stage.addChild(effectsContainer);
    app.stage.addChild(uiContainer);

    effectsContainerRef.current = effectsContainer;
    uiContainerRef.current = uiContainer;

    // Load Background
    const bgSprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.bg));
    bgSprite.width = width;
    bgSprite.height = height;
    bgContainer.addChild(bgSprite);

    // Load Player
    const playerSprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.hero));
    playerSprite.anchor.set(0.5, 1);
    playerSprite.filters = [chromaFilter];
    characterContainer.addChild(playerSprite);

    // Load Enemy
    const enemySprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
    enemySprite.anchor.set(0.5, 1);
    enemySprite.filters = [chromaFilter];
    characterContainer.addChild(enemySprite);

    spritesRef.current = { playerSprite, enemySprite };

    return () => {
      destroyedRef.current = true;
      try { app.ticker.stop(); } catch (e) { void e; }
      effectsContainerRef.current = null;
      uiContainerRef.current = null;
      spritesRef.current = {};
      try { app.destroy(true, { children: true, texture: true, baseTexture: true }); } catch (e) { void e; }
      appRef.current = null;
    };
  }, [width, height]);

  // Animation Loop
  useEffect(() => {
    const app = appRef.current;
    if (!app || destroyedRef.current) return;
    const { playerSprite, enemySprite } = spritesRef.current;
    if (!playerSprite || !enemySprite) return;

    // Set enemy texture dynamically
    const texUrl = ASSETS[enemy.name] || ASSETS["Slime"];
    enemySprite.texture = PIXI.Texture.from(texUrl);

    const ticker = () => {
      if (destroyedRef.current) return;
      frameRef.current++;
      const time = frameRef.current * 16.67;
      const uc = uiContainerRef.current;
      if (!uc) return;

      safeRemoveChildren(uc);

      // Dynamic Responsive Scaling
      if (playerSprite.texture.width > 1) {
        const targetHeight = height * 0.45;
        playerSprite.scale.set(targetHeight / playerSprite.texture.height);
      }
      if (enemySprite.texture.width > 1) {
        const targetHeight = height * (enemy.name === "Dragon" ? 0.6 : enemy.name === "Demon Lord" ? 0.55 : 0.45);
        enemySprite.scale.set(targetHeight / enemySprite.texture.height);
      }

      // Animation calculations
      const playerBob = player.state === "idle" ? Math.sin(time * 0.005) * 6 : 0;
      const playerAttack = player.state === "attack" ? 15 : 0; // Dash forward
      playerSprite.x = width * 0.25 + playerAttack;
      playerSprite.y = height * 0.75 + playerBob;
      playerSprite.tint = player.state === "hurt" ? 0xFF5555 : 0xFFFFFF;

      const enemyBob = enemy.state === "idle" ? Math.cos(time * 0.004) * 6 : 0;
      const enemyAttack = enemy.state === "attack" ? -15 : 0;
      enemySprite.x = width * 0.75 + enemyAttack;
      enemySprite.y = height * 0.75 + enemyBob;
      enemySprite.tint = enemy.state === "hurt" ? 0xFF5555 : 0xFFFFFF;

      // Draw UI (Responsive HP Bars centered over characters)
      const hpBarW = Math.min(width * 0.25, 140);
      const playerX = width * 0.25 - hpBarW / 2;
      const enemyX = width * 0.75 - hpBarW / 2;
      const hpBarY = height * 0.15;

      drawHpBar(uc, playerX, hpBarY, hpBarW, 12, player.hp, player.maxHp);
      drawHpBar(uc, enemyX, hpBarY, hpBarW, 12, enemy.hp, enemy.maxHp);

      const fontSize = Math.max(12, width * 0.02);

      const pLabel = new PIXI.Text(`Lv.${player.name}`, { fontFamily: "Courier New, monospace", fontSize, fontWeight: "bold", fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 3 });
      pLabel.x = playerX; pLabel.y = hpBarY - fontSize - 6;
      uc.addChild(pLabel);

      const eLabel = new PIXI.Text(enemy.name, { fontFamily: "Courier New, monospace", fontSize, fontWeight: "bold", fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 3 });
      eLabel.x = enemyX; eLabel.y = hpBarY - fontSize - 6;
      uc.addChild(eLabel);

      if (combo >= 8) {
        const fireG = new PIXI.Graphics();
        fireG.beginFill(0xED8936, 0.3 + Math.sin(time * 0.008) * 0.15);
        fireG.drawRect(0, height * 0.85, width, height * 0.15);
        fireG.endFill();
        uc.addChild(fireG);
      }
    };

    app.ticker.add(ticker);
    return () => { try { app.ticker.remove(ticker); } catch (e) { void e; } };
  }, [width, height, player, enemy, combo, safeRemoveChildren]);

  // Effects & Popups
  useEffect(() => {
    const ec = effectsContainerRef.current;
    if (!ec || destroyedRef.current) return;
    safeRemoveChildren(ec);
    effects.forEach(e => createParticle(ec, (e.x / 100) * width, (e.y / 100) * height, e.type));
    const timeout = setTimeout(() => safeRemoveChildren(ec), 800);
    return () => clearTimeout(timeout);
  }, [effects, width, height, safeRemoveChildren]);

  useEffect(() => {
    const uc = uiContainerRef.current;
    if (!uc || destroyedRef.current) return;
    const cleanup: (() => void)[] = [];
    damagePopups.forEach(popup => {
      const text = createDamagePopup(uc, popup.value, (popup.x / 100) * width, (popup.y / 100) * height, popup.isCrit, popup.isHeal);
      let cancelled = false;
      let frame = 0;
      const animate = () => {
        if (cancelled || destroyedRef.current) return;
        frame++;
        text.y -= 1.5;
        text.alpha = 1 - frame / 40;
        if (frame < 40) requestAnimationFrame(animate);
        else try { uc.removeChild(text); } catch (e) { void e; }
      };
      requestAnimationFrame(animate);
      cleanup.push(() => { cancelled = true; try { uc.removeChild(text); } catch (e) { void e; } });
    });
    return () => cleanup.forEach(fn => fn());
  }, [damagePopups, width, height]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" style={{ imageRendering: "pixelated" }} />
  );
}

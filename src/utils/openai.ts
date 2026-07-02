export interface AISpeakingResult {
  transcript: string;
  score: number;
  feedback: string;
  isSuccess: boolean;
}

export async function gradeSpeakingWithAI(
  apiKey: string,
  audioBlob: Blob,
  targetSentence: string,
  category: 'toeic' | 'n2'
): Promise<AISpeakingResult> {
  try {
    // 1. Transcribe audio with Whisper
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', category === 'toeic' ? 'en' : 'ja');
    
    const transcribeRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData
    });

    if (!transcribeRes.ok) {
      throw new Error(`Whisper API error: ${transcribeRes.statusText}`);
    }

    const transcribeData = await (transcribeRes.json() as Promise<{ text: string }>);
    const transcript = transcribeData.text.trim();

    // 2. Grade transcription with GPT-4o-mini
    const systemPrompt = `You are a strict language examiner for ${category === 'toeic' ? 'TOEIC Speaking' : 'JLPT N2 Speaking'}.
The user is supposed to say: "${targetSentence}".
They actually said: "${transcript}".
Evaluate their pronunciation and accuracy. Give a score from 0 to 100.
Provide a very brief 1-sentence feedback.
Respond ONLY in JSON format: {"score": number, "feedback": "string"}`;

    const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    if (!completionRes.ok) {
      throw new Error(`GPT API error: ${completionRes.statusText}`);
    }

    const completionData = await (completionRes.json() as Promise<{ choices: { message: { content: string } }[] }>);
    const resultObj = JSON.parse(completionData.choices[0].message.content);

    return {
      transcript,
      score: resultObj.score,
      feedback: resultObj.feedback,
      isSuccess: resultObj.score >= 70
    };
  } catch (error) {
    console.error('AI Grading failed:', error);
    throw error;
  }
}

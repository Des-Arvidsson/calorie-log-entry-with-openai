import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

let entries: { food: string; calories: number; date: string }[] = [];

const openai = new OpenAI({
  apiKey: '',
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { food, calories } = body;
  const date = new Date().toISOString().split('T')[0];

  entries.push({ food, calories, date });

  // Generate summary using OpenAI
  const prompt = `Here is a list of food eaten today with calories:\n${entries
    .filter((e) => e.date === date)
    .map((e) => `${e.food}: ${e.calories} kcal`)
    .join('\n')}\nSummarize today's intake in one sentence.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = completion.choices[0].message?.content;

    return NextResponse.json({
      entries: entries.filter((e) => e.date === date),
      summary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { entries: entries.filter((e) => e.date === date), summary: 'Error generating summary' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  return NextResponse.json({ entries: entries.filter((e) => e.date === date) });
}

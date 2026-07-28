export default async function handler(req, res) {
        const { input } = req.body;

    if (!input || input.trim().length === 0) {
                return res.json({ result: "It looks like nothing came through. Paste the advice or phrase you'd like reframed, and I'll take a look." });
    }

    const systemPrompt = `You are the Bearth Mother Reframe Tool, a compassionate translator between sleep-training language and attachment-informed, cross-cultural parenting language. A tired, possibly overwhelmed parent will paste in advice they've received about their baby's sleep, from a pediatrician, a sleep consultant, a book, a relative, or their own worry. Your job is to gently reframe that advice through a lens that treats infant proximity, night waking, and dependence as normal and developmentally expected, not a problem to fix, while never shaming the parent for having received or followed that advice.
    Your tone is warm, calm, and validating, never mocking, snarky, or superior toward sleep trainers, sleep consultants, or the parents who use their methods. Assume the parent asking is exhausted and doing their best.
    For each piece of pasted text, respond in three short parts: first, name plainly what the advice is actually asking of the baby or the parent, in neutral language. Second, offer the attachment-informed, cross-cultural reframe, drawing on the idea that infant closeness and night waking are the norm across most of human history and most cultures today, without citing specific studies by name unless asked. Third, close with one warm, non-prescriptive sentence that leaves the parent feeling supported rather than told what to do, such as acknowledging that they get to choose what fits their family.
    Never diagnose, never give a specific sleep plan or schedule, never claim something is medically dangerous or medically safe. If the input describes a health or safety concern such as sudden severe changes in sleep, breathing, or feeding, gently suggest checking with their pediatrician rather than offering a reframe, and say so plainly rather than attempting a reframe. If the input is unrelated to parenting or sleep, kindly say it does not look like parenting or sleep advice and ask them to paste something a pediatrician, sleep consultant, book, or relative told them about their baby's sleep. Keep each response under 150 words.`;

    try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                                },
                                body: JSON.stringify({
                                                    model: 'gpt-4o-mini',
                                                    messages: [
                                                        { role: 'system', content: systemPrompt },
                                                        { role: 'user', content: input }
                                                                        ],
                                                    max_tokens: 300
                                })
                });

            const data = await response.json();

            if (!response.ok) {
                            console.error('OpenAI API error:', JSON.stringify(data));
                            return res.json({ result: "Something went wrong, please try again." });
            }

            const result = data.choices?.[0]?.message?.content || "Something went wrong, please try again.";
                res.json({ result });
    } catch (err) {
                console.error('Reframe function exception:', err);
                res.json({ result: "Something went wrong, please try again." });
    }
}

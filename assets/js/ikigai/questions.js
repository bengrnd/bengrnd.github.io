export const AREAS = [
  {
    id: "love",
    number: "01",
    title: "What you love",
    shortTitle: "Love",
    prompt: "Notice the activities, subjects and moments that naturally pull you in.",
    questions: [
      { id: "love_energises", label: "What activities make you lose track of time?", hint: "Think about work, hobbies, conversations or things you make." },
      { id: "love_topics", label: "What subjects do you keep returning to, even without a deadline?", hint: "Books, videos, communities and recurring curiosities all count." },
      { id: "love_moments", label: "Which moments in the past few years felt most energising or meaningful?", hint: "Describe what you were doing and who was involved." },
      { id: "love_more", label: "If you had one free day every week, what would you want to spend it exploring?", hint: "There is no need for the answer to sound practical yet." }
    ]
  },
  {
    id: "good",
    number: "02",
    title: "What you are good at",
    shortTitle: "Strengths",
    prompt: "Look for demonstrated strengths as well as abilities you want to deepen.",
    questions: [
      { id: "good_others", label: "What do people reliably ask for your help with?", hint: "Consider colleagues, friends and family." },
      { id: "good_natural", label: "What feels relatively natural to you but difficult to others?", hint: "It may be a way of thinking, communicating, organising or creating." },
      { id: "good_proud", label: "What achievement or piece of work are you proudest of—and what skills made it possible?", hint: "Focus on the abilities behind the result." },
      { id: "good_grow", label: "Which skill would you be excited to become unusually good at?", hint: "Include strengths that are still developing." }
    ]
  },
  {
    id: "needs",
    number: "03",
    title: "What the world needs",
    shortTitle: "Needs",
    prompt: "Think at a human scale: a community, group or problem you genuinely care about.",
    questions: [
      { id: "needs_problems", label: "Which problems, frustrations or injustices are difficult for you to ignore?", hint: "They can be local, professional or global." },
      { id: "needs_people", label: "Who would you most like to help, and what would improve their lives?", hint: "A specific group often reveals more than “everyone”." },
      { id: "needs_change", label: "What change would you be proud to contribute to over the next five years?", hint: "Small, concrete progress is enough." },
      { id: "needs_missing", label: "What useful thing do you wish existed or worked much better?", hint: "Consider services, tools, knowledge and experiences." }
    ]
  },
  {
    id: "paid",
    number: "04",
    title: "What people may pay you for",
    shortTitle: "Value",
    prompt: "Explore practical value without reducing everything to your current job title.",
    questions: [
      { id: "paid_value", label: "What results could you create that someone would value enough to pay for?", hint: "Think in outcomes: saved time, better decisions, learning, enjoyment or reduced risk." },
      { id: "paid_evidence", label: "What have people or organisations already paid you—or someone similar—to do?", hint: "Include employment, freelance work, products and informal demand." },
      { id: "paid_people", label: "Who might need your strengths, and in what setting?", hint: "Name possible audiences, customers, teams or communities." },
      { id: "paid_format", label: "How would you most like to deliver that value?", hint: "For example: a role, service, product, course, tool, book or small business." }
    ]
  }
];

export const ALL_QUESTIONS = AREAS.flatMap((area) => area.questions);

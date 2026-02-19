// Mock article data — adapted from exidebt-minimal-ui

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  readTime: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'How Debt Restructuring Works in India',
    excerpt:
      'Debt restructuring can help you reduce your monthly EMI burden by up to 40%. Learn how the process works and who qualifies for it.',
    slug: 'how-debt-restructuring-works',
    category: 'Guide',
    readTime: '5 min read',
    content: `Debt restructuring is a process where a borrower negotiates with lenders to modify the terms of existing loans — typically to lower the interest rate, extend the tenure, or consolidate multiple debts into one.\n\n## Who qualifies?\n\nMost salaried individuals with a stable income and at least two active credit lines can qualify. The key factor lenders look at is your ability to repay under the new terms, not your current struggle.\n\n## How the process works\n\n1. **Assessment** — We pull your credit report and map all outstanding debts.\n2. **Analysis** — Our algorithm identifies which debts cost you the most in interest.\n3. **Proposal** — We create a restructuring plan that reduces your total monthly outgo.\n4. **Execution** — With your consent, we negotiate with lenders or help you apply for a consolidation loan.\n\n## What you save\n\nOn average, our users save ₹30,000 – ₹80,000 per year in interest charges alone. The earlier you restructure, the more you save.\n\n## Is it safe?\n\nYes. Debt restructuring is a fully legal process recognized by the RBI. It does not negatively impact your CIBIL score when done through proper channels.`,
  },
  {
    id: '2',
    title: '5 Credit Card Mistakes That Cost You Lakhs',
    excerpt:
      'From paying only the minimum due to revolving credit, these common mistakes can trap you in a cycle of high-interest debt.',
    slug: 'credit-card-mistakes',
    category: 'Tips',
    readTime: '4 min read',
    content: `Credit cards are powerful financial tools — but they become dangerous when misused. Here are five mistakes that silently drain your wealth.\n\n## 1. Paying Only the Minimum Due\n\nWhen you pay just the minimum (usually 5%), the remaining balance attracts interest at 36–42% per annum. A ₹1,00,000 balance can cost you ₹42,000 in interest in just one year.\n\n## 2. Revolving Credit\n\nIf you don't pay the full statement balance, you lose the interest-free period on ALL transactions — including new ones.\n\n## 3. Cash Advances\n\nWithdrawing cash from your credit card incurs fees from day one with no grace period.\n\n## 4. Too Many Cards\n\nEach card application triggers a hard inquiry on your credit report. Multiple inquiries lower your CIBIL score.\n\n## 5. Ignoring the Statement\n\nNot reviewing your monthly statement means you could miss unauthorized charges or interest rate hikes.\n\n## The Fix\n\nConsolidate high-interest credit card debt into a lower-rate personal loan. This single step can save you lakhs over time.`,
  },
  {
    id: '3',
    title: 'How Ravi Saved ₹1.2L by Restructuring His Loans',
    excerpt:
      'Ravi was paying 24% APR on two credit cards. After restructuring, he consolidated at 12% and saved over 1.2 lakhs in a year.',
    slug: 'ravi-success-story',
    category: 'Success Story',
    readTime: '3 min read',
    content: `Ravi, a 32-year-old software engineer in Bangalore, had accumulated ₹4.8L in credit card debt across two cards — both charging over 24% APR.\n\n## The Problem\n\nRavi's minimum payments were ₹14,400/month, but only ₹2,800 went toward the principal. The rest — over ₹11,600 — was pure interest.\n\n## What Changed\n\nAfter using ExiDebT's free health check, Ravi discovered he could consolidate both cards into a single personal loan at 12% APR.\n\n## The Result\n\n- **Before:** ₹14,400/month EMI, debt-free in 5+ years\n- **After:** ₹11,200/month EMI, debt-free in 3.2 years\n- **Annual savings:** ₹1,21,600\n\n## Ravi's Advice\n\n"I didn't realize how much I was losing to interest. The health check took 2 minutes and the call was completely free. I wish I'd done it sooner."`,
  },
  {
    id: '4',
    title: 'Understanding Your CIBIL Score: A Complete Guide',
    excerpt:
      'Your CIBIL score impacts everything from loan approvals to interest rates. Here is how to read, improve, and maintain a healthy score.',
    slug: 'understanding-cibil-score',
    category: 'Guide',
    readTime: '6 min read',
    content: `Your CIBIL score is a three-digit number (300–900) that represents your creditworthiness. Lenders use it to decide whether to approve your loan and at what interest rate.\n\n## Score Ranges\n\n- **750–900:** Excellent — you'll get the best rates\n- **700–749:** Good — most loans approved easily\n- **650–699:** Fair — approval possible but rates may be higher\n- **Below 650:** Poor — difficult to get unsecured credit\n\n## What Affects Your Score\n\n1. **Payment history (35%)** — Late payments hurt the most\n2. **Credit utilization (30%)** — Keep card usage below 30%\n3. **Credit age (15%)** — Older accounts improve your score\n4. **Credit mix (10%)** — A mix of secured and unsecured is ideal\n5. **New inquiries (10%)** — Too many applications lower your score\n\n## How to Improve\n\n- Pay all EMIs on time, every time\n- Reduce credit card balances below 30% of the limit\n- Don't close old credit cards\n- Avoid applying for multiple loans simultaneously\n- Check your report regularly for errors`,
  },
  {
    id: '5',
    title: 'Personal Loan vs Credit Card Debt: Which to Pay First?',
    excerpt:
      'The avalanche method suggests paying high-interest debt first, but the snowball method has psychological benefits.',
    slug: 'personal-loan-vs-credit-card',
    category: 'Strategy',
    readTime: '4 min read',
    content: `When you have multiple debts, deciding which to tackle first can feel overwhelming. Two popular strategies exist.\n\n## The Avalanche Method\n\nPay off the highest-interest debt first (usually credit cards at 36%+), while making minimum payments on everything else. This saves the most money mathematically.\n\n## The Snowball Method\n\nPay off the smallest balance first for a quick psychological win, then roll that payment into the next smallest debt.\n\n## Our Recommendation\n\nFor most Indians with a mix of credit card and personal loan debt, we recommend a **hybrid approach**:\n\n1. First, consolidate all high-interest credit card debt into a single low-rate personal loan\n2. Then use the avalanche method on the remaining debts\n\n## The Math\n\nIf you have ₹3L in credit card debt at 36% and ₹2L in personal loan at 14%, consolidating the credit card debt alone saves you ₹66,000/year in interest.`,
  },
  {
    id: '6',
    title: 'RBI Guidelines on Loan Restructuring 2025',
    excerpt:
      'The Reserve Bank of India has updated its loan restructuring framework. Here is what borrowers need to know.',
    slug: 'rbi-guidelines-restructuring',
    category: 'Regulatory',
    readTime: '5 min read',
    content: `The RBI periodically updates its framework for loan restructuring to help borrowers facing genuine financial difficulties.\n\n## Key Updates for 2025\n\n- **Eligibility expanded** — Salaried individuals with income disruption now qualify\n- **No NPA classification** — Restructured accounts are not classified as Non-Performing Assets\n- **Credit score protection** — The restructuring flag is removed after 12 months of timely payments\n\n## Who Can Apply\n\n- Borrowers with accounts that were standard as of the restructuring date\n- Individuals with demonstrable income to service the restructured EMI\n- Accounts that have not been restructured more than once before\n\n## The Process\n\n1. Submit a restructuring request to your lender\n2. Lender evaluates your income and repayment capacity\n3. New terms are offered (lower rate, longer tenure, or both)\n4. You sign the revised agreement\n\n## Important Note\n\nRestructuring through proper RBI-approved channels is very different from debt settlement, which can severely damage your credit score. Always choose restructuring over settlement when possible.`,
  },
];

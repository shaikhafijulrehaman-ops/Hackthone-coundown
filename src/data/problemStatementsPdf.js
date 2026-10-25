/**
 * Complete, authoritative problem statements extracted directly from the official PDF
 * MIC TECH-HACK 2K26 — Department of Artificial Intelligence & Machine Learning
 */

export const PDF_PROBLEM_STATEMENTS = [
  {
    id: "PS-01",
    pageNumber: 2,
    title: "Personalized Daily News Digest",
    subtitle: "PS-01 — End-of-Day Summarized News Email for Busy Users",
    category: "Natural Language Processing (NLP)",
    accentColor: "cyan",
    persona: 'Consider a busy professional (for example, "Arjun") who follows news across politics, technology, business, and sports, but has almost no time during the day to read full articles.',
    scenario: "Arjun starts work at 9 AM. Throughout the day, dozens of news articles appear on his phone, but meetings, deadlines, and travel leave him no time to read. By 8 PM he wants one short email that covers everything important from the day, grouped by topic, easy to skim in under 5 minutes, so he can stay informed without opening twenty tabs.",
    background: "Important updates arrive all day long. Reading every article is impractical. A single, well-organized summary at the end of the day would save time and still keep the user informed.",
    problem: "Build an ML-based system that collects a day’s news articles (from a provided dataset or sample feed), groups related stories, and generates a clear end-of-day digest that could be delivered as an email newsletter.",
    expectedOutputs: [
      "Topic-wise or ranked summary of the day’s news",
      "Short digest text suitable for an email body (subject line + sections)",
      "Evaluation of summarization quality (e.g., ROUGE / human readability notes) or clustering quality",
      "A simple demo: input day’s articles to output digest / mock email"
    ],
    suggestedTechniques: "Text summarization (extractive or abstractive), topic clustering, keyword extraction.",
    suggestedDataOrTools: "Public news datasets / RSS-style article collections / a curated sample of same-day articles."
  },
  {
    id: "PS-02",
    pageNumber: 3,
    title: "1990s Photo Style Generator",
    subtitle: "PS-02 — Build Your Own Retro Photo Generator",
    category: "Generative Models & Computer Vision",
    accentColor: "pink",
    persona: 'Consider a student (for example, "Meera") who loves the 1990s retro photo trend and wants to create vintage-style portraits and social media posts.',
    scenario: "Meera tries to generate 1990s-style photos using ChatGPT or Gemini, but the free tier limits how many images she can create per day. She wants her own simple tool where she can enter a prompt and get retro photo-style images anytime, without depending on paid chat limits.",
    background: "The 1990s photo look (film grain, soft flash, faded colors, old camera feel) is popular online. Many students use AI chat tools for this, but free plans run out quickly. A lightweight student-built generator can solve this problem.",
    problem: "Build an ML / generative AI tool that takes a text prompt and generates images in a 1990s vintage photo style. The solution should be runnable by students on a normal laptop or free cloud notebook, without relying on ChatGPT/Gemini image limits.",
    expectedOutputs: [
      "Working demo: prompt in, 1990s-style image out",
      "Sample prompts and generated retro photos",
      "Short note on model used and how the vintage look was achieved",
      "Simple comparison with one chat-tool output (optional)"
    ],
    suggestedTechniques: "Text-to-image diffusion models, prompt engineering for retro style, optional post-processing (grain, color fade, VHS-like effects).",
    suggestedDataOrTools: "Open lightweight image models suitable for students (local or notebook-based demo)."
  },
  {
    id: "PS-03",
    pageNumber: 4,
    title: "Smart Product Purchase Advisor",
    subtitle: "PS-03 — Survey-Based Best Product Suggestion Across Brands",
    category: "Recommendation Systems & NLP",
    accentColor: "teal",
    persona: 'Consider a shopper (for example, "Rohan") who wants to buy a product. Two or more options look good, but they are from different brands, and he cannot decide which one to buy.',
    scenario: "Rohan pastes product links he is comparing (for example, two mobile phones from different brands). The system checks that all links belong to the same product category. If one link is a mobile and another is a car (or any mixed category), the system must reject the request and ask him to compare only matching products. When all links are valid and same-category, it auto-generates a survey for that category, scores the products from his answers and available comments, and suggests which one to buy with product links.",
    background: "Brand comparison pages and star ratings are not enough. The “best” product depends on the user’s own requirements. First the category must match; then an auto-generated survey can capture needs, and an ML model can recommend what to buy.",
    problem: "Build an ML-based purchase advisor that: (1) Accepts two or more product links; (2) Detects category and enforces same-category comparison (mixed categories rejected); (3) Auto-generates a survey for that category; (4) Uses survey answers + review sentiment to recommend the best product with reasons and links.",
    expectedOutputs: [
      "Category check: same-category links accepted; mixed-category blocked with a clear message",
      "Auto-generated survey questions for the detected category",
      "Ranking / recommendation of the best product based on survey answers",
      "Short explanation why that product fits the user, plus product links from available comments / listing data"
    ],
    suggestedTechniques: "Category classification from product title/link/metadata, survey question generation, multi-criteria ranking, review / comment sentiment analysis.",
    suggestedDataOrTools: "Sample product listings with category, brand, price, features, comments/reviews, and links (public e-commerce style datasets or curated demo data)."
  },
  {
    id: "PS-04",
    pageNumber: 5,
    title: "Auto Analytics Report from Spreadsheet Data",
    subtitle: "PS-04 — Suggest Visualizations and Generate PDF Report",
    category: "Data Visualization & Analytics ML",
    accentColor: "amber",
    persona: 'Consider a user (for example, "Kavya") who has data in a CSV or Excel file and wants charts and insights, but she is new to data visualization and does not know which graphs to choose.',
    scenario: "Kavya uploads a CSV or Excel file (sales, student marks, survey results, etc.). The system reads the columns, suggests suitable visualizations (bar, line, pie, scatter, heatmap, and so on), builds those charts automatically, and generates a clean PDF analytics report she can download and share.",
    background: "Tools like Excel and BI software need manual chart setup. Beginners often pick the wrong chart or miss insights. An assisted pipeline can recommend visuals from the data types and produce a ready PDF report.",
    problem: "Build an ML / data analysis tool that (1) accepts a CSV or Excel upload, (2) profiles columns and suggests useful visualizations, (3) creates those charts, and (4) exports a PDF analytics report with charts plus short written insights.",
    expectedOutputs: [
      "Working demo: upload CSV/Excel to chart suggestions to generated visuals",
      "Auto-generated PDF analytics report with charts and brief insights",
      "Short note on how chart types were chosen from the data",
      "Sample run on at least one demo dataset"
    ],
    suggestedTechniques: "Data profiling, rule-based or ML chart recommendation, automated plotting, PDF report generation, optional simple insight text (trends, top categories, outliers).",
    suggestedDataOrTools: "Public CSV/Excel sample datasets (sales, education, health, or any clean tabular file for demo)."
  },
  {
    id: "PS-05",
    pageNumber: 6,
    title: "YouTube Study Companion",
    subtitle: "PS-05 — Captions to Summary, Flashcards, and Quiz",
    category: "Educational NLP & Assessment AI",
    accentColor: "purple",
    persona: 'Consider a learner (for example, "Ananya") who studies from YouTube lectures and tutorials, but often forgets key points and wants better exam-style preparation.',
    scenario: "Ananya copies and pastes a YouTube video link. The system fetches the video captions/transcript, summarizes the content, helps her understand the main ideas, and then builds flashcards and a quiz so she can revise and test herself.",
    background: "Watching a long video once is not enough for strong learning. Captions plus summarization, flashcards, and quizzes turn passive watching into active preparation.",
    problem: "Build an ML / NLP tool that (1) accepts a YouTube URL (or pasted captions for demo), (2) extracts captions/transcript, (3) generates a clear summary of the video, and (4) creates flashcards and a quiz to improve preparation.",
    expectedOutputs: [
      "Working demo: YouTube link or captions in, study materials out",
      "Video summary (key points / sections)",
      "Auto-generated flashcards from the content",
      "Auto-generated quiz (MCQ or short answers) for practice"
    ],
    suggestedTechniques: "Caption/transcript extraction, text summarization, question generation, key-concept extraction for flashcards.",
    suggestedDataOrTools: "Public caption APIs or a sample transcript file if live YouTube fetch is limited during the hackathon."
  }
];

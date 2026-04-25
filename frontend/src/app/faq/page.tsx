"use client";

import { Faq } from "@/components/Faq";

export default function FaqPage() {
  const faqItems = [
    {
      q: "What does the Application Assistant actually do?",
      a: "The Application Assistant helps you complete job applications faster and more accurately. It can autofill repetitive fields, generate tailored answers based on a job description, evaluate how well your resume matches a role, and keep track of the jobs you’ve applied to."
    },
    {
      q: "How does it generate answers for job applications?",
      a: "The assistant analyzes the job description along with your resume or profile details and generates relevant responses that you can review and edit."
    },
    {
      q: "Will the generated answers sound generic or AI-written?",
      a: "It depends on your input. The more detailed your job description and resume, the more personalized the answers will be."
    },
    {
      q: "How accurate is the resume scoring feature?",
      a: "It provides a directional assessment based on alignment with the job description. It helps identify gaps but is not a guarantee of interview success."
    },
    {
      q: "Can it automatically apply to jobs for me?",
      a: "No. It assists you in preparing applications, but you should review and submit them yourself."
    },
    {
      q: "Is my data stored or shared anywhere?",
      a: "Data is handled locally unless connected to backend services. Avoid entering highly sensitive information."
    },
    {
      q: "What kind of jobs does this work best for?",
      a: "It works best for roles with clear and structured job descriptions, especially in tech and corporate domains."
    },
    {
      q: "Do I still need to customize my applications?",
      a: "Yes. The assistant speeds up the process, but customization is still important."
    },
    {
      q: "What happens if I don’t provide a job description?",
      a: "The assistant will have limited context, resulting in weaker outputs."
    },
    {
      q: "Can I track all my job applications here?",
      a: "Yes. You can save and manage your applications using the built-in tracker."
    }
  ];

  return (
    <main className="container">
      <Faq items={faqItems} />
    </main>
  );
}
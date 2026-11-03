'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import TopicHeader from '@/components/topic/TopicHeader';
import SectionIntroduction from '@/components/topic/SectionIntroduction';
import SectionExplanation from '@/components/topic/SectionExplanation';
import InteractiveTruthTable from '@/components/topic/InteractiveTruthTable';
import SectionBooleanExpression from '@/components/topic/SectionBooleanExpression';
import InteractiveCircuitViewer from '@/components/topic/InteractiveCircuitViewer';
import SectionHardwareImplementation from '@/components/topic/SectionHardwareImplementation';
import SectionPracticeProblems from '@/components/topic/SectionPracticeProblems';
import TopicSidebar from '@/components/topic/TopicSidebar';

export default function TopicLearningPage() {
  const params = useParams();
  const moduleSlug = params?.moduleSlug as string;
  const topicSlug = params?.topicSlug as string;

  const { topics, modules, recordVisit } = useApp();

  const topic = topics.find(t => t.slug === topicSlug);
  const parentModule = modules.find(m => m.slug === moduleSlug || m.id === topic?.moduleId);

  // Synchronized input state between Truth Table and Circuit Simulator
  const [activeInputs, setActiveInputs] = useState<number[]>([]);

  useEffect(() => {
    if (topic) {
      recordVisit(topic.moduleId, topic.id, topic.slug, topic.title);
      // Initialize inputs from topic truth table or circuit
      if (topic.truthTable && topic.truthTable.inputs.length > 0) {
        setActiveInputs(topic.truthTable.inputs.map(() => 0));
      } else if (topic.circuitDiagram && topic.circuitDiagram.inputs.length > 0) {
        setActiveInputs(topic.circuitDiagram.inputs.map(i => i.defaultValue));
      }
    }
  }, [topic, recordVisit]);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Topic Not Found</h2>
        <p className="text-slate-500">The topic you requested could not be located in the curriculum database.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950">
      {/* Topic Header & Breadcrumbs */}
      <TopicHeader topic={topic} module={parentModule} />

      {/* Main Content Area + Table of Contents Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main 8-Section Learning Content */}
          <main className="flex-1 w-full min-w-0 space-y-12">
            {/* Section A: Introduction */}
            <SectionIntroduction topic={topic} />

            {/* Section B: Detailed Technical Explanation */}
            <SectionExplanation topic={topic} />

            {/* Section C: Verified Truth Table */}
            {topic.truthTable && (
              <InteractiveTruthTable
                truthTable={topic.truthTable}
                activeInputs={activeInputs}
                onInputChange={setActiveInputs}
              />
            )}

            {/* Section D: Boolean Expression & Derivation */}
            {topic.booleanExpression && (
              <SectionBooleanExpression data={topic.booleanExpression} />
            )}

            {/* Sections E & F: Interactive Circuit Diagram & Simulation */}
            {topic.circuitDiagram && (
              <InteractiveCircuitViewer
                circuit={topic.circuitDiagram}
                truthTable={topic.truthTable}
                externalInputs={activeInputs}
                onInputChange={setActiveInputs}
              />
            )}

            {/* Section G: Real Hardware Implementation (Components, Breadboard, ICs, Pinouts) */}
            {topic.hardwareImplementation && (
              <SectionHardwareImplementation hardware={topic.hardwareImplementation} />
            )}

            {/* Section H: Practice Problems & MCQs */}
            {topic.practiceProblems && topic.practiceProblems.length > 0 && (
              <SectionPracticeProblems problems={topic.practiceProblems} />
            )}
          </main>

          {/* Sticky Table of Contents & Module Sidebar */}
          <TopicSidebar currentTopic={topic} module={parentModule} />
        </div>
      </div>
    </div>
  );
}

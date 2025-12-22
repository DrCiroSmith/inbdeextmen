import React, { useState } from 'react';
import {
  INBDE_INFO,
  FOUNDATION_KNOWLEDGE_DOMAINS,
  PATIENT_CARE_DOMAINS,
  RECOMMENDED_STUDY_SCHEDULE,
  HIGH_YIELD_TOPICS,
  EXAM_DAY_TIPS
} from '../constants';

interface ExamInfoProps {
  onClose: () => void;
}

type TabType = 'overview' | 'domains' | 'schedule' | 'highyield' | 'tips';

export const ExamInfo: React.FC<ExamInfoProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Exam Overview', icon: '📋' },
    { id: 'domains', label: 'Content Domains', icon: '📚' },
    { id: 'schedule', label: 'Study Schedule', icon: '📅' },
    { id: 'highyield', label: 'High-Yield Topics', icon: '⭐' },
    { id: 'tips', label: 'Exam Day Tips', icon: '💡' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{INBDE_INFO.name}</h2>
              <p className="text-blue-100">{INBDE_INFO.fullName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{INBDE_INFO.description}</p>
              </div>

              {/* Exam Format */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span> Exam Format
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex justify-between">
                      <span>Total Questions:</span>
                      <span className="font-semibold">{INBDE_INFO.format.totalQuestions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Scored Questions:</span>
                      <span className="font-semibold">{INBDE_INFO.format.scoredQuestions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Pilot (Unscored):</span>
                      <span className="font-semibold">{INBDE_INFO.format.pilotQuestions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Test Days:</span>
                      <span className="font-semibold">{INBDE_INFO.format.days} days</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sessions per Day:</span>
                      <span className="font-semibold">{INBDE_INFO.format.sessionsPerDay}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Time per Session:</span>
                      <span className="font-semibold">{INBDE_INFO.format.timePerSession}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total Time/Day:</span>
                      <span className="font-semibold">{INBDE_INFO.format.totalTime}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span> Scoring & Results
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex justify-between">
                      <span>Passing Score:</span>
                      <span className="font-semibold text-green-600">{INBDE_INFO.scoring.passingScore}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Score Range:</span>
                      <span className="font-semibold">{INBDE_INFO.scoring.scoreRange}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Results Delay:</span>
                      <span className="font-semibold">{INBDE_INFO.scoring.reportDelay}</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Cost</h4>
                    <p className="text-gray-700">{INBDE_INFO.cost}</p>
                  </div>
                </div>
              </div>

              {/* Eligibility */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✅</span> Eligibility Requirements
                </h3>
                <ul className="space-y-2">
                  {INBDE_INFO.eligibility.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🏢 Testing Windows</h3>
                  <p className="text-gray-700">{INBDE_INFO.testingWindows}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🔄 Retake Policy</h3>
                  <p className="text-gray-700">{INBDE_INFO.retakePolicy}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Domains Tab */}
          {activeTab === 'domains' && (
            <div className="space-y-8">
              {/* Foundation Knowledge */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">📖</span>
                  Foundation Knowledge (Biomedical Sciences)
                </h3>
                <div className="space-y-4">
                  {FOUNDATION_KNOWLEDGE_DOMAINS.map((domain) => (
                    <div key={domain.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                        className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
                            {domain.percentage}
                          </span>
                          <span className="font-semibold text-gray-900">{domain.name}</span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedDomain === domain.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedDomain === domain.id && (
                        <div className="p-4 bg-white">
                          <p className="text-gray-600 mb-4">{domain.description}</p>
                          <h4 className="font-semibold text-gray-800 mb-2">Key Topics:</h4>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {domain.topics.map((topic, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-700">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Care */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">🏥</span>
                  Patient Care Assessment (Clinical Sciences)
                </h3>
                <div className="space-y-4">
                  {PATIENT_CARE_DOMAINS.map((domain) => (
                    <div key={domain.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                        className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                            {domain.percentage}
                          </span>
                          <span className="font-semibold text-gray-900">{domain.name}</span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedDomain === domain.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedDomain === domain.id && (
                        <div className="p-4 bg-white">
                          <p className="text-gray-600 mb-4">{domain.description}</p>
                          <h4 className="font-semibold text-gray-800 mb-2">Key Topics:</h4>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {domain.topics.map((topic, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-700">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Study Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">📚 Recommended Study Timeline</h3>
                <p className="text-gray-600">A structured 20-30 week study plan for comprehensive INBDE preparation</p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {RECOMMENDED_STUDY_SCHEDULE.map((phase, index) => (
                  <div key={phase.phase} className="relative pl-20 pb-8">
                    {/* Timeline dot */}
                    <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow ${
                      index === 0 ? 'bg-green-500' :
                      index === RECOMMENDED_STUDY_SCHEDULE.length - 1 ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`}></div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">
                          Phase {phase.phase}: {phase.name}
                        </h4>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          {phase.duration}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>📚</span> Focus Areas
                          </h5>
                          <ul className="space-y-2">
                            {phase.focus.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-600">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>💡</span> Study Tips
                          </h5>
                          <ul className="space-y-2">
                            {phase.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-600">
                                <span className="text-yellow-500 mt-1">★</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Yield Topics Tab */}
          {activeTab === 'highyield' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span><strong>High-yield topics</strong> are frequently tested concepts that you should master for the INBDE.</span>
                </p>
              </div>

              <div className="grid gap-4">
                {HIGH_YIELD_TOPICS.map((subject) => (
                  <div key={subject.subject} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSubject(expandedSubject === subject.subject ? null : subject.subject)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{subject.subject}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{subject.topics.length} topics</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedSubject === subject.subject ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedSubject === subject.subject && (
                      <div className="p-4 bg-white border-t border-gray-100">
                        <ul className="grid md:grid-cols-2 gap-3">
                          {subject.topics.map((topic, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <span className="text-yellow-500 mt-1">★</span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Day Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">🎯 Exam Day Checklist</h3>
                <p className="text-blue-100">Essential tips to maximize your performance on test day</p>
              </div>

              <div className="grid gap-4">
                {EXAM_DAY_TIPS.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{tip}</p>
                  </div>
                ))}
              </div>

              {/* Additional Resources */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📌</span> Important Reminders
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <h5 className="font-semibold text-gray-800 mb-2">Before the Exam</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Get adequate sleep (7-8 hours)</li>
                      <li>• Eat a nutritious breakfast</li>
                      <li>• Review your ID requirements</li>
                      <li>• Know your testing center location</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <h5 className="font-semibold text-gray-800 mb-2">During the Exam</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Take optional breaks if needed</li>
                      <li>• Use all available time</li>
                      <li>• Flag and return to difficult questions</li>
                      <li>• Stay hydrated during breaks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Information based on current INBDE guidelines. Always verify with official ADA/JCNDE sources.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

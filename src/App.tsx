import './App.css'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import SectionCard from './components/SectionCard'
import BankGuaranteeForm from './components/BankGuaranteeForm'
import ApplicantDeliveryForm from './components/ApplicantDeliveryForm'
import BeneficiaryForm from './components/BeneficiaryForm'
import TotalOrderForm from './components/TotalOrderForm'

function App() {
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSection, setExpandedSection] = useState<number>(1);

  const markComplete = (section: number) => {
    if (!completedSections.includes(section)) {
      setCompletedSections(prev => [...prev, section]);
    }
    setExpandedSection(section + 1);
  };

  const handleEdit = (section: number) => {
    setCompletedSections(prev => prev.filter(s => s !== section));
    setExpandedSection(section);
  };

  const toggleSection = (section: number) => {
    setExpandedSection(prev => prev === section ? 0 : section);
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4">
            <span className="text-sm text-text-light">
              <span className="text-text hover:text-primary cursor-pointer">Drafts</span>
              <span className="mx-1.5">&gt;</span>
              <span className="text-text-dark">Edit details</span>
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <SectionCard
              number={1}
              title="Bank & Letter of Guarantee details"
              isCompleted={completedSections.includes(1)}
              isExpanded={expandedSection === 1 && !completedSections.includes(1)}
              onEdit={() => handleEdit(1)}
              onToggle={() => toggleSection(1)}
            >
              <BankGuaranteeForm onSubmit={() => markComplete(1)} />
            </SectionCard>

            <SectionCard
              number={2}
              title="Applicant & Delivery details"
              isCompleted={completedSections.includes(2)}
              isExpanded={expandedSection === 2 && !completedSections.includes(2)}
              onEdit={() => handleEdit(2)}
              onToggle={() => toggleSection(2)}
            >
              <ApplicantDeliveryForm onSubmit={() => markComplete(2)} />
            </SectionCard>

            <SectionCard
              number={3}
              title="Beneficiary & Liability details"
              isCompleted={completedSections.includes(3)}
              isExpanded={expandedSection === 3 && !completedSections.includes(3)}
              onEdit={() => handleEdit(3)}
              onToggle={() => toggleSection(3)}
            >
              <BeneficiaryForm onSubmit={() => markComplete(3)} />
            </SectionCard>

            <SectionCard
              number={4}
              title="Total Order Amount details"
              isCompleted={completedSections.includes(4)}
              isExpanded={expandedSection === 4 && !completedSections.includes(4)}
              onEdit={() => handleEdit(4)}
              onToggle={() => toggleSection(4)}
            >
              <TotalOrderForm onSubmit={() => markComplete(4)} />
            </SectionCard>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

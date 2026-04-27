import { AiOutlineHome, AiOutlineAppstore } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { GoArrowSwitch } from "react-icons/go";


const sidebarIcons = [
  { icon: AiOutlineHome, label: 'Home' },
  { icon: GoArrowSwitch, label: 'Requests' },
  { icon: AiOutlineAppstore, label: 'Services', active: true },
  { icon: FiSettings, label: 'Settings' },
];

const guaranteeSubItems = [
  { label: 'Request New Guarantee' },
  { label: 'Active Guarantees', count: 19 },
  { label: 'Closed Guarantees', count: 10 },
  { label: 'Pending Guarantees', count: 14 },
  { label: 'Drafts', count: 4, isActive: true },
];

const Sidebar = () => {
  return (
    <aside className="flex h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col items-center gap-1 py-4 px-2 bg-white border-r border-border w-14 shrink-0">
        {sidebarIcons.map((item) => (
          <button
            key={item.label}
            className={`group w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer
              ${item.active
                ? 'bg-gray-100'
                : ''
              }`}
            aria-label={item.label}
          >
            <item.icon className={`w-5 h-5 transition-colors ${item.active ? 'text-accent' : 'text-text-light group-hover:text-accent'}`} />
          </button>
        ))}
      </div>


      <div className="w-52 bg-white border-r border-border py-4 px-4 overflow-y-auto shrink-0">

        <h3 className="text-xs font-semibold text-sidebar-active uppercase tracking-wider mb-3 leading-tight">
          OPEN BANKING<br />SERVICES
        </h3>


        <nav className="flex flex-col gap-0.5">
          <a href="#" className="text-sm text-text-dark hover:text-primary py-1.5 transition-colors">
            E-Statements
          </a>
          <a href="#" className="text-sm text-text-dark hover:text-primary py-1.5 transition-colors">
            Credit check
          </a>


          <a href="#" className="text-sm text-accent font-medium py-1.5">
            Letter of Guarantee
          </a>


          <div className="ml-3 flex flex-col gap-0.5">
            {guaranteeSubItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center justify-between text-xs py-1.5 transition-colors
                  ${item.isActive
                    ? 'text-sidebar-active font-semibold bg-primary-light rounded-md px-2 -mx-2'
                    : 'text-text hover:text-text-dark'
                  }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className={`text-xs font-semibold min-w-[20px] text-right
                    ${item.isActive ? 'text-sidebar-active' : 'text-accent'}
                  `}>
                    {String(item.count).padStart(2, '0')}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

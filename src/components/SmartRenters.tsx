import { Briefcase, TrendingUp, Heart } from 'lucide-react';

const groups = [
  {
    icon: Briefcase,
    title: 'Career mobility',
    people: ['Tech workers relocating', 'Consultants moving cities', 'Remote professionals'],
  },
  {
    icon: TrendingUp,
    title: 'Financial flexibility',
    people: ['Entrepreneurs building companies', 'Freelancers changing markets', 'Investors diversifying'],
  },
  {
    icon: Heart,
    title: 'Life changes',
    people: ['Couples upgrading homes', 'Family moves', 'Buying a first home'],
  },
];

export default function SmartRenters() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Who uses LeaseFlex
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Smart renters protect their flexibility
          </h2>
          <p className="mt-4 text-neutral-500">
            People whose lives move fast.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {groups.map((group) => (
            <div
              key={group.title}
              className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 mb-4">
                <group.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.people.map((person) => (
                  <p key={person} className="text-sm text-neutral-500">
                    {person}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-lg font-semibold text-neutral-900 max-w-xl mx-auto">
          LeaseFlex gives renters the freedom to say yes to life opportunities.
        </p>
      </div>
    </section>
  );
}

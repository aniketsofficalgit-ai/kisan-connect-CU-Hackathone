import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Users,
  Target,
  Award,
  Leaf,
  Flame,
  ArrowRight,
  CheckCircle2,
  TreeDeciduous,
  Factory,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const About = () => {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const teamMembers = [
    {
      name: isHi ? 'प्रखर' : 'Prakhar',
      role: t('prakhar_role'),
      focus: t('prakhar_focus')
    },
    {
      name: isHi ? 'आयुष' : 'Ayush',
      role: t('ayush_role'),
      focus: t('ayush_focus')
    },
    {
      name: isHi ? 'राज' : 'Raj',
      role: t('raj_role'),
      focus: t('raj_focus')
    },
    {
      name: isHi ? 'अनिकेत दुबे' : 'Aniket Dubey',
      role: t('aniket_role'),
      focus: t('aniket_focus')
    }
  ];

  const milestones = [
    {
      year: '01',
      title: t('milestone_challenge_title'),
      desc: t('milestone_challenge_desc')
    },
    {
      year: '02',
      title: t('milestone_innovation_title'),
      desc: t('milestone_innovation_desc')
    },
    {
      year: '03',
      title: t('milestone_impact_title'),
      desc: t('milestone_impact_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F3]">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2ECE0] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#15803D] text-xs font-heading font-extrabold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                <span>{t('about_badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-heading font-black text-[#0D3823] tracking-tight leading-[1.1]">
                {t('about_title')}
              </h1>

              <p className="text-base sm:text-lg text-[#4B6354] leading-relaxed max-w-2xl font-normal font-sans">
                {t('about_desc')}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/waste-marketplace"
                  className="btn-primary text-sm sm:text-base py-3 px-7 shadow-md shadow-[#16A34A]/20"
                >
                  {t('about_explore_btn')} <ArrowRight size={17} />
                </Link>
                <Link
                  to="/find-partners"
                  className="btn-secondary text-sm sm:text-base py-3 px-7 shadow-xs hover:border-[#16A34A]"
                >
                  {t('about_partners_btn')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E2ECE0] shadow-xl aspect-4/5 sm:aspect-auto sm:h-[460px]">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
                  alt="Indian farmers working sustainably in agricultural field"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-wider font-heading font-extrabold text-[#E8BD59] block">
                    {isHi ? 'ग्रामीण समुदायों का सशक्तिकरण' : 'Empowering Rural Communities'}
                  </span>
                  <p className="text-sm font-medium mt-1 text-white/95 font-sans">
                    {isHi ? 'पंजाब, हरियाणा, उत्तर प्रदेश एवं गुजरात में टिकाऊ बेलिंग और अपशिष्ट संग्रहण।' : 'Sustainable baling and waste collection in Punjab, Haryana, Uttar Pradesh & Gujarat.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#68A66A] block mb-2">
            {isHi ? 'किसान कनेक्ट का उद्देश्य' : 'Why Kisan Connect Exists'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#20392A] tracking-tight">
            {isHi ? 'हमारा उद्देश्य और मुख्य मूल्य' : 'Our Purpose & Core Values'}
          </h2>
          <p className="text-base sm:text-lg text-[#56715E] mt-3 font-sans">
            {isHi ? 'जमीनी कृषि वास्तविकताओं पर आधारित, वास्तविक आर्थिक एवं पर्यावरणीय लाभ देने के लिए निर्मित।' : 'Built from grassroots agricultural realities to deliver real economic and environmental returns.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-4 hover:border-[#68A66A] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center">
              <Leaf size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#20392A]">{isHi ? 'पराली जलाना बंद करें' : 'Eradicate Stubble Burning'}</h3>
            <p className="text-sm text-[#56715E] leading-relaxed font-sans">
              {isHi
                ? 'हम खेतों में पराली जलाने की मजबूरी को स्वचालित बेलर नेटवर्क से बदलते हैं, जिससे हवा की गुणवत्ता सुधरती है और मिट्टी की जैविक उर्वरता नष्ट होने से बचती है।'
                : 'We replace dangerous field burning with synchronized mechanical baling networks, preserving air quality across North India and protecting soil organic matter from thermal destruction.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-4 hover:border-[#68A66A] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#20392A]">{isHi ? 'किसानों की सीधी समृद्धि' : 'Direct Farmer Prosperity'}</h3>
            <p className="text-sm text-[#56715E] leading-relaxed font-sans">
              {isHi
                ? 'कृषि अवशेषों को बोझ के बजाय सुनिश्चित आय स्रोत में बदलना। किसानों को पारदर्शी डिजिटल वजन सत्यापन और सीधे बैंक में भुगतान मिलता है।'
                : 'Transforming agricultural byproducts from a disposal liability into a guaranteed revenue stream. Farmers receive transparent digital weight verification and direct payments.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-4 hover:border-[#68A66A] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center">
              <Factory size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#20392A]">{isHi ? 'औद्योगिक चक्रीयता' : 'Industrial Circularity'}</h3>
            <p className="text-sm text-[#56715E] leading-relaxed font-sans">
              {isHi
                ? 'बायोमास पेलेट संयंत्रों, कंपोस्ट निर्माताओं और अधिकृत प्लास्टिक रीसाइक्लर्स को निरंतर, सत्यापित कच्चा माल उपलब्ध कराना।'
                : 'Supplying biomass briquetting plants, pellet manufacturers, vermicompost producers, and authorized plastic recycling units with traceable, continuous raw materials.'}
            </p>
          </div>
        </div>

        {/* The 3-Step Journey Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-8">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#20392A] text-center">
            {isHi ? 'कृषि अपशिष्ट का चक्रीय सफर' : 'The Circular Journey of Farm Waste'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m) => (
              <div key={m.year} className="p-7 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0] space-y-3">
                <span className="text-3xl font-black text-[#347A46]/30 font-mono">{m.year}</span>
                <h4 className="text-lg font-heading font-bold text-[#20392A]">{m.title}</h4>
                <p className="text-xs sm:text-sm text-[#56715E] leading-relaxed font-sans">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Clover Guardian Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#347A46] bg-[#E8F1E5] px-4 py-1.5 rounded-full inline-block mb-3">
              {isHi ? 'मंच के निर्माता इंजीनियर्स' : 'The Engineers Behind the Platform'}
            </span>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#20392A]">
              {t('team_heading')}
            </h3>
            <p className="text-sm text-[#56715E] mt-2 font-sans">
              {t('team_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white p-7 rounded-3xl border border-[#E2ECE0] shadow-xs hover:shadow-md transition-all text-center space-y-3.5 group hover:border-[#68A66A]"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mx-auto text-xl font-heading font-extrabold border border-[#E2ECE0] group-hover:bg-[#347A46] group-hover:text-white transition-all">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-[#20392A]">{member.name}</h4>
                  <p className="text-xs font-heading font-bold text-[#68A66A] mt-1">{member.role}</p>
                </div>
                <p className="text-xs text-[#56715E] pt-3 border-t border-[#E2ECE0] font-sans">
                  {member.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Standards & Certifications Bar */}
        <div className="p-8 rounded-3xl bg-white border border-[#E2ECE0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#347A46] text-[#E8BD59] flex items-center justify-center shrink-0 shadow-sm">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-base font-heading font-extrabold text-[#20392A]">
                {isHi ? 'राष्ट्रीय स्वच्छ वायु कार्यक्रम (NCAP) एवं CPCB दिशानिर्देशों के अनुरूप' : 'Aligned with National Clean Air Programme (NCAP) & CPCB Guidelines'}
              </h4>
              <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                {isHi ? 'कृषि मंत्रालय की बायो-अपशिष्ट मूल्य संवर्धन योजनाओं और एक्स-सीटू फसल अवशेष प्रबंधन सब्सिडी के अनुरूप।' : 'Complies with Ministry of Agriculture bio-waste valorization schemes and Ex-Situ crop residue management subsidies.'}
              </p>
            </div>
          </div>
          <Link
            to="/recycling-education"
            className="btn-primary text-xs py-3 px-6 font-heading font-bold shrink-0"
          >
            {isHi ? 'रीसाइक्लिंग दिशानिर्देश पढ़ें →' : 'Read Recycling Guidelines →'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

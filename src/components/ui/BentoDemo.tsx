import { FileTextIcon, CalendarIcon } from '@radix-ui/react-icons';
import { BellIcon, Share2Icon } from 'lucide-react';
import { BentoCard, BentoGrid } from './BentoGrid';
import { useTheme } from '../../context/ThemeContext';

interface FileItem {
  name: string;
  body: string;
}

interface Feature {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  href?: string;
  cta?: string;
  className?: string;
  content?: string;
}

const files: FileItem[] = [
  {
    name: 'bitcoin.pdf',
    body: 'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.',
  },
  {
    name: 'finances.xlsx',
    body: 'A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.',
  },
  {
    name: 'logo.svg',
    body: 'Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.',
  },
  {
    name: 'keys.gpg',
    body: 'GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.',
  },
  {
    name: 'seed.txt',
    body: 'A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.',
  },
];

const features: Feature[] = [
  {
    Icon: FileTextIcon,
    name: 'Save your files',
    description: 'We automatically save your files as you type.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    content: `Available files: ${files.map(f => f.name).join(', ')}`,
  },
  {
    Icon: BellIcon,
    name: 'Notifications',
    description: 'Get notified when something happens.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    content: 'Real-time notifications keep you updated on important events and actions.',
  },
  {
    Icon: Share2Icon,
    name: 'Integrations',
    description: 'Supports 100+ integrations and counting.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    content: 'Seamlessly connect with your favorite tools and services.',
  },
  {
    Icon: CalendarIcon,
    name: 'Calendar',
    description: 'Use the calendar to filter your files by date.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    content: 'Organize and access your files by date with an intuitive calendar interface.',
  },
];

export function BentoDemo() {
  const { isDark } = useTheme();

  return (
    <BentoGrid className={`p-6 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {features.map((feature, idx) => (
        <BentoCard
          key={idx}
          Icon={feature.Icon}
          name={feature.name}
          description={feature.description}
          href={feature.href}
          cta={feature.cta}
          className={feature.className}
        />
      ))}
    </BentoGrid>
  );
}

export default BentoDemo;

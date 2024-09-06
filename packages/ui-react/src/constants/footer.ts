import { TFooterConfig, TFooterMenuItem, TFrequentlyAskedQuestionsSection } from '../types/footer';

export const FOOTER_CONFIG: TFooterConfig = {
  logoIconType: 'footerLogo',
  describe: [
    'ETransfer - Your Universal Gateway to Seamless Transfers.',
    'Securely between aelf and other popular networks.',
  ],
  faq: {
    name: 'FAQ',
    iconType: 'questionMarkLarge',
    link: 'https://etransfer.gitbook.io/docs/faq',
  },
  menus: [
    {
      group: 'Community',
      iconType: 'community',
      items: [
        {
          name: 'Twitter',
          iconType: 'twitter',
          iconBigType: 'twitterBig',
          link: 'https://x.com/ETransfer_Web3',
        },
        {
          name: 'Discord',
          iconType: 'discord',
          iconBigType: 'discordBig',
          link: 'https://discord.gg/zuN2wrZrd9',
        },
        {
          name: 'Telegram',
          iconType: 'telegram',
          iconBigType: 'telegramBig',
          link: 'https://t.me/etransferofficial',
        },
      ],
    },
    {
      group: 'Developers',
      iconType: 'developer',
      items: [
        {
          name: 'Documentation',
          link: 'https://etransfer.gitbook.io/docs',
        },
        {
          name: 'Wallet',
          link: 'https://doc.portkey.finance/docs/How-to-download-Portkey',
        },
        {
          name: 'Explorer',
          link: 'https://aelfscan.io',
        },
      ],
    },
    {
      group: 'Legal',
      iconType: 'legal',
      items: [
        {
          name: 'Terms of Service',
          link: 'https://etransfer.gitbook.io/docs/more-information/terms-of-service',
        },
        {
          name: 'Privacy Policy',
          link: 'https://etransfer.gitbook.io/docs/more-information/privacy-policy',
        },
      ],
    },
    {
      group: 'Contacts',
      iconType: 'contacts',
      items: [
        {
          name: 'Emails',
          link: 'mailto:contact@etransfer.exchange',
        },
        {
          name: 'Support',
          link: 'https://t.me/etransfer_support',
        },
      ],
    },
  ],
};

export const DOCUMENTATION_LINK: Record<string, TFooterMenuItem> = {
  aboutETransfer: {
    name: 'What is ETransfer?',
    link: 'https://etransfer.gitbook.io/docs/faq#what-is-etransfer',
  },
  depositProcess: {
    name: 'How to deposit to aelf by ETransfer?',
    link: 'https://etransfer.gitbook.io/docs/faq#how-to-deposit-to-aelf-by-etransfer',
  },
  withdrawProcess: {
    name: 'How to withdraw from aelf by ETransfer?',
    link: 'https://etransfer.gitbook.io/docs/faq#how-to-withdraw-from-aelf-by-etransfer',
  },
  notArrived: {
    name: 'The assets have not arrived.',
    link: 'https://etransfer.gitbook.io/docs/faq#my-assets-have-not-arrived',
  },
  completedTime: {
    name: 'How long does it take for the transfer to be completed?',
    link: 'https://etransfer.gitbook.io/docs/faq#how-long-does-it-take-for-the-transfer-to-be-completed',
  },
};

export const FAQ_DEPOSIT: TFrequentlyAskedQuestionsSection = {
  title: 'FAQ',
  list: [
    DOCUMENTATION_LINK.aboutETransfer,
    DOCUMENTATION_LINK.depositProcess,
    DOCUMENTATION_LINK.notArrived,
    DOCUMENTATION_LINK.completedTime,
  ],
};

export const FAQ_WITHDRAW: TFrequentlyAskedQuestionsSection = {
  title: 'FAQ',
  list: [
    DOCUMENTATION_LINK.aboutETransfer,
    DOCUMENTATION_LINK.withdrawProcess,
    DOCUMENTATION_LINK.notArrived,
    DOCUMENTATION_LINK.completedTime,
  ],
};

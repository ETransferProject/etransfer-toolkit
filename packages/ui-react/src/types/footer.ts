import { TSvgListType } from './common';

export type TFooterConfig = {
  logoIconType: TSvgListType;
  describe: string[];
  faq: TFrequentlyAskedQuestions;
  menus: TFooterMenu[];
};

export type TFooterMenu = {
  group: string;
  items: TFooterMenuItem[];
  iconType: TSvgListType;
};

export type TFooterMenuItem = {
  name: string;
  link: string;
  iconType?: TSvgListType;
  iconBigType?: TSvgListType;
};

export type TFrequentlyAskedQuestions = Omit<Required<TFooterMenuItem>, 'iconBigType'>;

export type TFrequentlyAskedQuestionsSection = {
  title: string;
  list: TFooterMenuItem[];
};

/**
 * 获奖人信息
 */
export interface Recipient {
  name: string;
  employeeId: string;
  department: string;
}

/**
 * 团队成员信息
 */
export interface TeamMember {
  name: string;
  employeeId: string;
  department: string;
  role?: string;
}

/**
 * 团队信息
 */
export interface Team {
  id: string;
  name: string;
  leaderName: string;
  leaderId: string;
  memberCount: number;
  members?: TeamMember[];
}

/**
 * 奖项类型
 */
export type AwardType = 'individual' | 'team';

/**
 * 奖项信息
 */
export interface Award {
  id: string;
  title: string;
  issuingDepartment: string;
  awardType: AwardType;
  recipients: Recipient[];
  teams?: Team[];
  /** 是否被选中用于展播 */
  selected?: boolean;
}

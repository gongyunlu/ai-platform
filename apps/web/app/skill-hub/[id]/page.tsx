import { notFound } from 'next/navigation';

import { getSkillDetail } from '../skill-detail';
import { SkillDetailClient } from './skill-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = getSkillDetail(id);
  if (!detail) {
    notFound();
  }
  // 服务端一次性拉齐 detail 并作为 props 下发，客户端组件不再 import SKILLS，
  // 避免 1080 条 mock 数据被间接打入 client bundle。
  return <SkillDetailClient detail={detail} />;
}


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding data...')

    // 1. Training Programs
    await prisma.trainingProgram.createMany({
        data: [
            {
                term: "제자훈련",
                note: "평신도를 깨워 동역자로 세우는 훈련",
                participants: "세례교인 이상",
                period: "1년 (32주)",
                curriculum: JSON.stringify([
                    { week: 1, content: "오리엔테이션 및 구원의 확신", note: "교재 1과" },
                    { week: 2, content: "하나님의 속성", note: "교재 2과" },
                    { week: 3, content: "성경의 권위", note: "교재 3과" },
                    { week: 4, content: "기도의 능력", note: "교재 4과" },
                    { week: 5, content: "교제와 섬김", note: "교재 5과" },
                    { week: 6, content: "전도와 선교", note: "교재 6과" },
                    { week: 7, content: "성령 충만", note: "교재 7과" },
                    { week: 8, content: "영적 전쟁", note: "교재 8과" }
                ])
            },
            {
                term: "사역훈련",
                note: "제자훈련 수료자를 위한 리더십 훈련",
                participants: "제자훈련 수료자",
                period: "1년 (30주)",
                curriculum: JSON.stringify([
                    { week: 1, content: "리더십의 기초", note: "리더십 원리" },
                    { week: 2, content: "소그룹 인도법", note: "인도자 가이드" },
                    { week: 3, content: "목양의 실제", note: "심방과 상담" },
                    { week: 4, content: "은사 발견", note: "은사 테스트" },
                    { week: 5, content: "교회 행정", note: "부서 관리" }
                ])
            }
        ]
    })

    // 2. Domestic Mission
    await prisma.ministry.createMany({
        data: [
            { category: 'DOMESTIC', name: '미자립교회 지원', count: 12, description: '농어촌 및 미자립 교회 후원' },
            { category: 'DOMESTIC', name: '기관 후원', count: 5, description: '선교 단체 및 복지 기관 후원' }
        ]
    })

    await prisma.ministryStat.create({
        data: {
            category: 'DOMESTIC',
            data: JSON.stringify({
                evangelism: { frequency: "주 1회", desc: "노방 전도 및 거점 전도" },
                service: { frequency: "월 2회", desc: "지역 사회 섬김" }
            })
        }
    })

    // 3. Overseas Mission
    await prisma.ministry.createMany({
        data: [
            {
                category: 'OVERSEAS',
                name: '김철수', location: '필리핀', count: 120, // believers
                roleInfo: JSON.stringify({ spouse: '이영희', children: '김하늘, 김바다' })
            },
            {
                category: 'OVERSEAS',
                name: '박신광', location: '캄보디아', count: 50,
                roleInfo: JSON.stringify({ spouse: '최은혜', children: '박소망' })
            },
            {
                category: 'OVERSEAS',
                name: '정믿음', location: '태국', count: 35,
                roleInfo: JSON.stringify({ spouse: '-', children: '-' })
            }
        ]
    })

    // 4. Committees
    await prisma.ministry.createMany({
        data: [
            { category: 'COMMITTEE', name: '새가족 위원회', icon: 'UserCheck', description: '새가족 등록 및 정착 지원', roleInfo: JSON.stringify({ chair: '박위원장' }) },
            { category: 'COMMITTEE', name: '사회봉사 위원회', icon: 'Heart', description: '지역 사회 섬김 및 구제', roleInfo: JSON.stringify({ chair: '최사랑' }) },
            { category: 'COMMITTEE', name: '감사 위원회', icon: 'FileText', description: '교회 재정 및 행정 감사', roleInfo: JSON.stringify({ chair: '정감사' }) },
            { category: 'COMMITTEE', name: '재정 위원회', icon: 'Calculator', description: '교회 예산 관리 및 집행', roleInfo: JSON.stringify({ chair: '김재정' }) },
            { category: 'COMMITTEE', name: '예산 기획 위원회', icon: 'FileText', description: '연간 예산 계획 및 수립', roleInfo: JSON.stringify({ chair: '이기획' }) },
            { category: 'COMMITTEE', name: '미디어 위원회', icon: 'Monitor', description: '방송, 홈페이지, 영상 사역', roleInfo: JSON.stringify({ chair: '박영상' }) }
        ]
    })

    // 5. Men's Group
    await prisma.ministry.createMany({
        data: [
            { category: 'MEN', name: '1남선교회', description: '70세 이상', roleInfo: JSON.stringify({ president: '김장로', vp: '이집사' }) },
            { category: 'MEN', name: '2남선교회', description: '60-69세', roleInfo: JSON.stringify({ president: '박장로', vp: '최집사' }) },
            { category: 'MEN', name: '3남선교회', description: '50-59세', roleInfo: JSON.stringify({ president: '이권사', vp: '정집사' }) },
            { category: 'MEN', name: '4남선교회', description: '40-49세', roleInfo: JSON.stringify({ president: '유집사' }) },
            { category: 'MEN', name: '5남선교회', description: '30-39세', roleInfo: JSON.stringify({ president: '윤성도' }) }
        ]
    })

    await prisma.ministryStat.create({
        data: {
            category: 'MEN',
            data: JSON.stringify({
                totalMembers: "120명",
                meetingInfo: { period: "매월 3주", time: "주일 오후 1시" },
                eventInfo: { count: "연 2회", season: "봄/가을", title: "행사/대회" }
            })
        }
    })

    // 6. Women's Group
    await prisma.ministry.createMany({
        data: [
            { category: 'WOMEN', name: '1여전도회', description: '70세 이상', roleInfo: JSON.stringify({ president: '김권사' }) },
            { category: 'WOMEN', name: '2여전도회', description: '60-69세', roleInfo: JSON.stringify({ president: '이권사', secretary: '박집사' }) },
            { category: 'WOMEN', name: '3여전도회', description: '50-59세', roleInfo: JSON.stringify({ president: '최권사', accountant: '정집사' }) },
            { category: 'WOMEN', name: '4여전도회', description: '40-49세', roleInfo: JSON.stringify({ president: '정집사' }) },
            { category: 'WOMEN', name: '5여전도회', description: '30-39세', roleInfo: JSON.stringify({ president: '오성도' }) }
        ]
    })

    await prisma.ministryStat.create({
        data: {
            category: 'WOMEN',
            data: JSON.stringify({
                totalMembers: "250명",
                meetingInfo: { period: "매월 3주", time: "주일 3부 예배 후" },
                eventInfo: { count: "연 2회", season: "봄/가을", title: "바자회/수련회" }
            })
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

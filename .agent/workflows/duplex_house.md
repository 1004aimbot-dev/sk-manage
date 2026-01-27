---
description: 소형 복층 주택 도면/입면/단면/3D/파사드 자동 생성 파이프라인
---

이 워크플로우는 사용자의 평수 입력을 받아 소형 복층 주택의 전체 설계안을 생성합니다.

# 1. Input Normalization & Program
사용자 입력(바닥 평수 등)을 `program.json`으로 정규화합니다.
- **Role**: Space Program Generator
- **Output**: `outputs/{project_name}/01_program/program.json`, `program.md`
- **Rules**:
  - `floor_area_pyeong` 필수 (기본값 12평 등 활용)
  - `duplex_type`, `roof_type` 설정

# 2. Plans Generator
1층 및 2층 평면도를 생성합니다.
- **Output**: `outputs/{project_name}/02_plans/plan_1f.png`, `plan_2f.png`, `plans.pdf`
- **Checklist**:
  - 동선(현관→거실→주방) 막힘 없음
  - 폰트/사이즈 통일, 중앙 정렬
  - 내력벽/가벽 수치 포함

# 3. Sections Generator
단면도 A, B를 생성합니다.
- **Output**: `outputs/{project_name}/03_sections/section_a.png`, `section_b.png`, `sections.pdf`
- **Checklist**:
  - 1층 층고 2.4m, 복층 2.1m 준수
  - 계단 각도 및 지붕선 논리 확인

# 4. Elevations Generator
4면 입면도를 생성합니다.
- **Output**: `outputs/{project_name}/04_elevations/front.png`, `back.png`, `left.png`, `right.png`, `elevations.pdf`
- **Checklist**:
  - 창호 정렬/비례 일관성 유지
  - 정면 중심성 확보

# 5. 3D Massing Generator
건축물의 매스(형태)를 보여주는 3D 이미지를 생성합니다.
- **Output**: `outputs/{project_name}/05_3d/massing_iso.png`, `massing_views.png`

# 6. Facade Design Generator
선택된 스타일(modern, minimal 등)을 적용하여 투시도를 생성합니다.
- **Output**: `outputs/{project_name}/06_facade/facade_day.png`, `facade_night.png`

# 7. Summary Report
전체 프로젝트 요약 리포트를 생성합니다.
- **Output**: `outputs/{project_name}/07_summary/summary_onepage.pdf`, `summary.md`
- **Content**:
  - 생성된 파일 리스트
  - 설계 요약(면적/구성/포인트)
  - 파사드 컨셉 3줄 설명

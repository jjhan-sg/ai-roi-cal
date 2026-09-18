# AX PORTFOLIO MANAGER & AI ROI SIMULATOR

> **범용 AI 전환(AX) 과제 발굴·평가·투자·실행·성과관리 통합 플랫폼 (PRD v3.0 기준)**  
> 현업의 AX 포트폴리오 관리와 TCO 관점의 다차원 ROI 시뮬레이션을 위한 **웹(Web)**, **앱(App)**, **엑셀(Excel)** 3가지 형태의 통합 구현체

---

## 📌 3대 배포 형태 및 실행 가이드

### 1. 엑셀 모델 (Excel - Financial Modeling)
- **파일 위치**: [`excel/AX_Portfolio_Manager_ROI_Simulator.xlsx`](file:///C:/Users/jjhan/OneDrive%20-%20%E3%88%9C%EC%94%A8%EC%A0%A0/snowid/30.Private/Antigravity/ai-roi-cal/excel/AX_Portfolio_Manager_ROI_Simulator.xlsx)
- **구현 특징**:
  - **530개 엑셀 표준 수식(Formulas) 완벽 구현**: 하드코딩 없이 `=SUM`, `=NPV`, `=IF`, `=ROUND`, `=INDEX/MATCH` 기반 동적 재계산 모델링.
  - **재무 모델링 표준 색상 규칙 준수**: 
    - 🔵 파란색 텍스트 (`#0000FF`): 사용자 직접 입력값(Inputs)
    - ⚫ 검정색 텍스트 (`#000000`): 수식 계산값(Formulas)
    - 🟢 초록색 텍스트 (`#008000`): 타 시트 참조 링크(Cross-Sheet References)
    - 🟡 연노랑 배경 (`#FEF3C7`): 핵심 주의 가정 및 KPI 요약 결과
  - **8대 시트 구성**:
    1. `00_README_가이드`: 서식 표준, 색상 범례, 수식 예외 규칙
    2. `01_조직_업무템플릿`: 8대 기능군 및 26개 부록 A 표준 업무 템플릿 마스터 카탈로그
    3. `02_포트폴리오_관리대장`: 전사 10대 과제 라이프사이클(G0~G6) 및 가중 우선순위 평가
    4. `03_워크플로우_세부분석`: 6단계 AS-IS vs AI TO-BE 세부 시간 분해 (절감시간 산출)
    5. `04_TCO_8대비용군_산정`: One-time 구축비 및 월 반복비용의 1Y/3Y/5Y 생애주기 TCO
    6. `05_편익_5대항목_산정`: 생산성(실현계수 분리), 직접비, 품질, 리스크조정, 매출기여
    7. `06_ROI_현금흐름_시뮬레이터`: 36개월 월별 현금흐름, 회수기간 가드, 3대 시나리오(보수/기준/공격) 및 NPV/ROI
    8. `07_가치실현_KPI추적`: Baseline vs Target vs Actual 실측치 달성률 및 편차 관리

### 2. 웹 포털 (Web Application)
- **파일 위치**: [`web/index.html`](file:///C:/Users/jjhan/OneDrive%20-%20%E3%88%9C%EC%94%A8%EC%A0%A0/snowid/30.Private/Antigravity/ai-roi-cal/web/index.html)
- **실행 방법**:
  - 웹 브라우저(Chrome, Edge)에서 `web/index.html` 파일을 직접 열거나,
  - `python app/start_app.py` 또는 `app/start_app.bat`을 실행하여 로컬 웹 서버(`http://localhost:8080/web/index.html`)로 접속.
- **핵심 8대 모듈**:
  1. **Home / 빠른 시작**: 조직에서 추천 업무 찾기 & 자연어 자유 설명 기반 2가지 진입 경로 제공
  2. **조직·업무 카탈로그**: 8개 기능 분류 및 26개 표준 업무 템플릿 실시간 검색·필터
  3. **Workflow Discovery Studio**: 6단계 세부 분해, AS-IS vs TO-BE 비교, Human-in-the-loop(HITL) 통제점 지정, 실시간 절감시간 산출
  4. **AX Portfolio Manager**: 목록 뷰 및 Kanban 보드 (Idea~Optimize 8단계), G0~G6 게이트 승인 워크플로우
  5. **AI ROI Simulator**: 인건비 단가, 실현계수(30%~100%), 할인율(WACC), 자동화율 슬라이더 조절 시 36개월 현금흐름 곡선, 회수기간(Payback), 3대 시나리오 실시간 시각화
  6. **Value Realization**: 실제 운영 KPI 실측치 대비 편차 분석 및 Action Item 트래킹
  7. **위험 거버넌스 & 감사**: Tier 1~3 위험 등급 통제 및 변경 불가 감사 이벤트 로그(Audit Trail)
  8. **경영진 보고서**: Executive Briefing 및 투자 심의 메모, 인쇄 및 PDF 저장 지원

### 3. 설치형 앱 (App - Standalone / Mobile PWA)
- **실행 및 설치 방법**:
  - **Windows 데스크톱 앱**: [`app/start_app.bat`](file:///C:/Users/jjhan/OneDrive%20-%20%E3%88%9C%EC%94%A8%EC%A0%A0/snowid/30.Private/Antigravity/ai-roi-cal/app/start_app.bat) 더블 클릭 시 Edge/Chrome 기반 **독립 실행 창(`--app` 모드)**으로 주소창 없이 네이티브 데스크톱 앱 형태로 실행.
  - **PWA 설치**: 브라우저 상단 **[📥 앱 설치]** 버튼 또는 브라우저 주소창 우측 '앱으로 설치' 아이콘 클릭 시 바탕화면/시작메뉴/스마트폰 홈 화면에 바로가기 앱 설치.
  - **모바일 앱 뷰어**: 웹 화면 상단의 **[📱 앱 모드 전환]** 버튼을 클릭하면 스마트폰/태블릿 규격 화면과 하단 모바일 내비게이션 바(홈, 카탈로그, 스튜디오, 포트폴리오, ROI, 성과)로 전환.
  - **오프라인 동작**: `sw.js` (Service Worker)와 `manifest.json`이 내장되어 인터넷 연결 없이도 로컬 환경에서 구동 가능.

---

## 🗂️ 프로젝트 구조

```
ai-roi-cal/
├── excel/
│   ├── AX_Portfolio_Manager_ROI_Simulator.xlsx  # 530개 수식 내장 재무/포트폴리오 엑셀 모델
│   ├── generate_excel_model.py                   # 엑셀 모델 생성 및 서식화 스크립트
│   ├── verify_model.py                           # 엑셀 수식 무결성 검증 스크립트
│   └── inspect_cells.py                          # 셀 좌표 및 참조 검사 도구
├── web/
│   ├── index.html                                # 반응형 웹 포털 & PWA 앱 단일 페이지
│   ├── styles.css                                # 엔터프라이즈 모던 테마 및 앱 모드 스타일
│   ├── data.js                                   # 8개 기능, 26개 부록A 템플릿, 10개 과제 마스터 데이터
│   ├── app.js                                    # ROI 계산 엔진, 상태 관리 및 인터랙티브 SVG 차트
│   ├── manifest.json                             # PWA 모바일/데스크톱 설치 매니페스트
│   ├── sw.js                                     # 오프라인 캐싱 Service Worker
│   ├── icon-192.png / icon-512.png               # 고해상도 앱 아이콘
│   └── generate_icons.py                         # 아이콘 생성 스크립트
├── app/
│   ├── README.md                                 # 앱 모드 및 PWA 설치 상세 가이드
│   ├── start_app.py                              # 독립 실행 앱 & 로컬 서버 런처
│   └── start_app.bat                             # Windows 원클릭 실행 배치 파일
└── README.md                                     # 전체 프로젝트 통합 문서 (본 파일)
```

---

## 📐 핵심 계산 모델 및 방어 규칙 (PRD v3.0 준수)

1. **AS-IS vs TO-BE 시간 분해 (PRD 9.2절)**:
   - $T_{human\_residual} = T_{baseline} \times (1 - R_{auto})$
   - $T_{review} = T_{baseline} \times R_{auto} \times R_{review}$
   - $T_{exception} = T_{baseline} \times R_{failure} \times R_{exception\_handling}$
   - $T_{rework} = R_{error} \times T_{avg\_rework}$
   - $T_{TO-BE} = T_{human\_residual} + T_{review} + T_{exception} + T_{rework}$
   - $T_{saved} = T_{baseline} - T_{TO-BE}$

2. **5대 다차원 편익 (PRD 9.3~9.5절)**:
   - 생산성 가치: $HoursSaved \times HourlyCost \times CapacityRealizationRate$ *(기본 70% 보수적 적용)*
   - 직접비 회피: 외주 용역 및 유휴 소프트웨어 라이선스 감축액
   - 품질 개선: 오기입 및 재작업/보고서 재발행 비용 절감
   - 리스크 조정 편익: $(Prob_{base} \times Imp_{base} - Prob_{res} \times Imp_{res}) \times Conf \times Realization$
   - 매출/기회 편익: 시스템 가동시간(MTTR) 단축에 따른 업무 중단 손실 회피

3. **8대 TCO 비용군 (PRD 9.1절)**:
   - 1) 발견·설계, 2) 구축·통합, 3) 플랫폼·사용량, 4) 운영·유지보수, 5) 사람·변화관리, 6) 통제·컴플라이언스, 7) 공통비 배부, 8) 종료·전환

4. **부록 B.1 계산 예외 방어 규칙**:
   - **투자회수기간 가드**: 월 순편익(Net Monthly Benefit) $\le 0$ 또는 36개월 내 미회수 시 `회수 불가`로 명시.
   - **ROI 계산 방어**: 초기비용과 할인 TCO가 모두 0일 경우 `계산 불가`로 처리.
   - **고위험 승인 통제(AC-010)**: Tier 1 과제는 보안/위험 승인 완료 전 운영(Production) 전환 차단.

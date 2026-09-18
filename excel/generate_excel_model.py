import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def create_ax_roi_model():
    wb = openpyxl.Workbook()
    default_sheet = wb.active

    # Standard styling palettes
    font_name = "Malgun Gothic"
    title_font = Font(name=font_name, size=16, bold=True, color="1E3A8A")
    subtitle_font = Font(name=font_name, size=10, italic=True, color="475569")
    section_font = Font(name=font_name, size=12, bold=True, color="1E293B")
    header_font = Font(name=font_name, size=10, bold=True, color="FFFFFF")
    sub_header_font = Font(name=font_name, size=10, bold=True, color="1E293B")
    
    # Value fonts
    input_font = Font(name=font_name, size=10, color="0000FF")      # Blue: Hardcoded input
    formula_font = Font(name=font_name, size=10, color="000000")    # Black: Formula
    link_font = Font(name=font_name, size=10, color="008000")       # Green: Cross-sheet link
    bold_formula_font = Font(name=font_name, size=10, bold=True, color="000000")
    kpi_highlight_font = Font(name=font_name, size=11, bold=True, color="1E3A8A")

    # Fills
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")     # Navy
    sub_header_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid") # Slate light
    input_fill = PatternFill(start_color="F0F7FF", end_color="F0F7FF", fill_type="solid")      # Soft Blue
    total_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")      # Soft Amber
    accent_fill = PatternFill(start_color="EEF2FF", end_color="EEF2FF", fill_type="solid")     # Indigo light
    zebra_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

    # Borders
    thin_border_side = Side(border_style="thin", color="CBD5E1")
    thick_bottom_side = Side(border_style="medium", color="1E3A8A")
    double_bottom_side = Side(border_style="double", color="1E3A8A")
    top_thin_side = Side(border_style="thin", color="1E293B")

    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    header_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thick_bottom_side)
    total_border = Border(left=thin_border_side, right=thin_border_side, top=top_thin_side, bottom=double_bottom_side)

    # Alignments
    left_align = Alignment(horizontal="left", vertical="center")
    center_align = Alignment(horizontal="center", vertical="center")
    right_align = Alignment(horizontal="right", vertical="center")

    # Number formats
    FMT_CURRENCY = '#,##0;(#,##0);"-"'
    FMT_PERCENT = '0.0%'
    FMT_NUMBER = '#,##0.0'
    FMT_INT = '#,##0'

    # ==========================================
    # 1. Sheet: 00_README_가이드
    # ==========================================
    ws_readme = wb.create_sheet(title="00_README_가이드")
    ws_readme.views.sheetView[0].showGridLines = True

    ws_readme['B2'] = "AX PORTFOLIO MANAGER & AI ROI SIMULATOR"
    ws_readme['B2'].font = title_font
    ws_readme['B3'] = "범용 AI 전환 과제 발굴·평가·투자·실행·성과관리 통합 재무 시뮬레이션 모델 (PRD v3.0 기준)"
    ws_readme['B3'].font = subtitle_font

    ws_readme['B5'] = "■ 모델 개요 및 목적"
    ws_readme['B5'].font = section_font
    ws_readme['B6'] = "본 엑셀 모델은 현업의 AX(AI Transformation) 과제를 8대 기능 분류 및 자유 워크플로우를 기반으로 발굴하고,"
    ws_readme['B7'] = "8대 TCO(총소유비용)와 5대 편익군(생산성, 직접비, 품질, 리스크, 매출)을 수식 모델링하여"
    ws_readme['B8'] = "월별 현금흐름, 회수기간 가드, 시나리오별 NPV/ROI 및 실제 성과 추적을 제공하는 기업용 표준 시뮬레이터입니다."
    for r in range(6, 9): ws_readme[f'B{r}'].font = Font(name=font_name, size=10)

    # Color code table
    ws_readme['B10'] = "■ 재무 모델 서식 및 색상 표준 (Global Financial Modeling Standard)"
    ws_readme['B10'].font = section_font
    
    headers_legend = ["구분", "텍스트 색상", "배경 색상", "설명 및 용도"]
    for col_idx, h in enumerate(headers_legend, start=2):
        cell = ws_readme.cell(row=11, column=col_idx, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align
        cell.border = header_border

    legend_data = [
        ("직접 입력값 (Hardcoded Inputs)", "파란색 (Blue #0000FF)", "연파랑 (#F0F7FF)", "사용자가 시나리오 및 조건에 따라 직접 수정하는 가정 수치"),
        ("수식 계산값 (Formulas)", "검정색 (Black #000000)", "흰색 / 무색", "SUM, NPV, IF 등 수식으로 자동 계산되는 결과 셀 (직접 수정 금지)"),
        ("타 시트 참조 링크 (Cross-Sheet)", "초록색 (Green #008000)", "흰색 / 무색", "동일 통합문서 내 다른 시트에서 값을 가져오는 참조 셀"),
        ("핵심 주의 가정 (Attention Required)", "진파랑 / 검정", "연노랑 (#FEF3C7)", "민감도가 높거나 경영진 확정 및 승인이 필수적인 핵심 가정"),
        ("합계 및 최종 결과 (Total / KPI)", "굵은 검정 / 진청색", "연노랑 / 강조색", "소계, 총계 및 NPV, ROI, 회수기간 등 최종 의사결정 지표")
    ]
    for row_idx, data in enumerate(legend_data, start=12):
        ws_readme.cell(row=row_idx, column=2, value=data[0]).font = Font(name=font_name, size=10, bold=True)
        ws_readme.cell(row=row_idx, column=3, value=data[1]).font = Font(name=font_name, size=10, color="0000FF" if "Blue" in data[1] else ("008000" if "Green" in data[1] else "000000"))
        ws_readme.cell(row=row_idx, column=4, value=data[2]).font = Font(name=font_name, size=10)
        ws_readme.cell(row=row_idx, column=5, value=data[3]).font = Font(name=font_name, size=10)
        for col_idx in range(2, 6):
            c = ws_readme.cell(row=row_idx, column=col_idx)
            c.border = cell_border
            if "연파랑" in data[2]: c.fill = input_fill
            elif "연노랑" in data[2]: c.fill = total_fill

    # Sheet Guide
    ws_readme['B19'] = "■ 시트 구성 및 워크플로우 안내"
    ws_readme['B19'].font = section_font

    sheet_guides = [
        ("01_조직_업무템플릿", "PRD 제5장 & 부록 A", "8대 기능별 조직 분류 및 26개 표준 업무 템플릿 마스터 카탈로그"),
        ("02_포트폴리오_관리대장", "PRD 제7장 & 제10장", "전사 AX 과제 등록, 상태(Idea~Production), G0~G6 게이트 및 종합 우선순위 점수 평가"),
        ("03_워크플로우_세부분석", "PRD 제6장 & 9.2절", "선정 과제의 6단계 세부 분해 (AS-IS vs TO-BE, 자동화율, 검토/예외/재작업, 절감시간)"),
        ("04_TCO_8대비용군_산정", "PRD 9.1절", "초기구축비, 플랫폼사용량, 운영, 통제, 공통비배부 등 8대 비용군의 1Y/3Y/5Y 생애주기 TCO"),
        ("05_편익_5대항목_산정", "PRD 9.3~9.5절", "생산성(실현계수 분리), 직접비, 품질, 리스크조정, 매출기여 편익의 1Y/3Y/5Y 상세 산출"),
        ("06_ROI_현금흐름_시뮬레이터", "PRD 9.3 & 9.7절", "36개월 월별 현금흐름, 할인율 반영 NPV, 회수기간 가드('회수 불가'), 3대 시나리오 및 민감도"),
        ("07_가치실현_KPI추적", "PRD 제14장", "기준선 vs 목표 vs 실제 KPI 달성도 비교 및 편차 분석, 개선 Action Item 추적 관리")
    ]
    
    for col_idx, h in enumerate(["시트명", "PRD 조항", "핵심 내용 및 기능"], start=2):
        c = ws_readme.cell(row=20, column=col_idx, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    for r_i, s_data in enumerate(sheet_guides, start=21):
        ws_readme.cell(row=r_i, column=2, value=s_data[0]).font = Font(name=font_name, size=10, bold=True, color="1E3A8A")
        ws_readme.cell(row=r_i, column=3, value=s_data[1]).font = Font(name=font_name, size=10, color="475569")
        ws_readme.cell(row=r_i, column=4, value=s_data[2]).font = Font(name=font_name, size=10)
        for c_i in range(2, 5): ws_readme.cell(row=r_i, column=c_i).border = cell_border

    # Calculation Rules
    ws_readme['B30'] = "■ 부록 B.1 계산 예외 및 방어 규칙"
    ws_readme['B30'].font = section_font
    rules = [
        "1. [회수기간 가드]: 순월간편익(Net Monthly Benefit) <= 0 또는 투자 미회수 시 payback_months는 '회수 불가'로 표시합니다.",
        "2. [ROI 방어]: 초기비용(One-time Cost)과 할인 TCO가 모두 0일 경우 ROI는 '계산 불가'로 예외 처리합니다.",
        "3. [생산성 실현계수]: 절감 시간 100%를 현금 편익으로 과대계상하지 않도록 실현계수(기본 70%)를 분리 적용합니다.",
        "4. [리스크 조정 편익]: (기준확률*영향 - 잔여확률*영향) * 증적신뢰도 * 실현확률 공식을 준수합니다.",
        "5. [보수적 시나리오 기본]: 투자심의 시에는 보수적 시나리오(낮은 자동화, 높은 실패율, 높은 TCO)를 우선 검토합니다."
    ]
    for idx, rule in enumerate(rules, start=31):
        ws_readme.cell(row=idx, column=2, value=rule).font = Font(name=font_name, size=9.5, color="334155")

    ws_readme.column_dimensions['A'].width = 3
    ws_readme.column_dimensions['B'].width = 32
    ws_readme.column_dimensions['C'].width = 24
    ws_readme.column_dimensions['D'].width = 28
    ws_readme.column_dimensions['E'].width = 46

    # ==========================================
    # 2. Sheet: 01_조직_업무템플릿
    # ==========================================
    ws_tmpl = wb.create_sheet(title="01_조직_업무템플릿")
    ws_tmpl.views.sheetView[0].showGridLines = True

    ws_tmpl['B2'] = "■ 범용 조직 및 업무 카탈로그 (PRD 제5장 및 부록 A)"
    ws_tmpl['B2'].font = title_font
    ws_tmpl['B3'] = "8대 기업 기능 영역 및 26개 부록 A 표준 업무 워크플로우 템플릿 마스터 데이터"
    ws_tmpl['B3'].font = subtitle_font

    tmpl_headers = ["No", "기능 영역 (대분류)", "표준 업무명", "기본 워크플로우 단계", "추천 AI 적용 패턴", "기본 통제점 및 보안 요건", "예상 자동화율", "데이터 민감도"]
    for c_i, h in enumerate(tmpl_headers, start=2):
        c = ws_tmpl.cell(row=5, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    templates_data = [
        (1, "정보기술·데이터", "서비스데스크 문의 처리", "접수 → 분류 → 지식검색 → 답변/티켓 → 에스컬레이션 → 종료", "검색/RAG, 분류·추출", "출처 표시, 개인정보 마스킹, 티켓 권한 상속", 0.65, "보통"),
        (2, "정보기술·데이터", "주간 장애 및 운영 보고", "로그/티켓 수집 → 영향분석 → 원인/조치 정리 → 초안생성 → 검토 → 배포", "요약·작성, 분석·탐지", "사람 검토 후 배포, 기밀시스템 마스킹", 0.70, "대외비"),
        (3, "정보기술·데이터", "접근권한 정기 검토", "대상추출 → 부서확인 → 이상탐지 → 승인 → 회수 → 증적", "분석·탐지, Agent/Workflow", "최종 승인권자 결재 필수, 감사 증적 보존", 0.50, "기밀"),
        (4, "정보기술·데이터", "데이터 정합성 점검", "추출 → 규칙검증 → 오류분류 → 수정요청 → 재검증 → 보고", "분류·추출, 분석·탐지", "규칙 위반 이력 보존, 원본 DB 쓰기 통제", 0.75, "보통"),
        (5, "정보기술·데이터", "AI 사용·비용 분석", "사용량수집 → 비용배부 → 활용분석 → 이상탐지 → 권고 → 보고", "분석·탐지, 추천·의사결정", "비용 이상 탐지 알림, 과금 데이터 감사", 0.80, "내부용"),
        (6, "보안·개인정보", "보안 경보 분석 (SIEM)", "경보수집 → 맥락보강 → 유사사례 → 위험판단 → 조치권고 → 검토", "분석·탐지, 검색/RAG", "설명 가능성, 오탐 검토, 침해대응 책임자 확인", 0.60, "극비/기밀"),
        (7, "보안·개인정보", "취약점 조치 관리", "스캔수집 → 중복제거 → 자산/위협 결합 → 우선순위 → 배정 → 검증", "분류·추출, 추천·의사결정", "패치 전 테스트 검증, 영향도 평가", 0.55, "기밀"),
        (8, "보안·개인정보", "개인정보 처리활동 정리", "인터뷰/문서수집 → 활동분류 → 데이터흐름 → 보유/제공 → 검토 → 등록", "요약·작성, 분류·추출", "CPO/개인정보보호책임자 최종 승인", 0.50, "개인정보"),
        (9, "연구개발", "문헌·특허 선행 조사", "질문정의 → 검색 → 선별 → 추출 → 비교 → 요약 → 전문가검증", "검색/RAG, 요약·작성", "원문 출처 표기, 특허 침해 판단은 변리사 검토", 0.65, "대외비"),
        (10, "연구개발", "실험 기록 요약 및 분석", "기록수집 → 정규화 → 이상/누락 → 결과요약 → 해석초안 → 검토", "요약·작성, 분석·탐지", "실험 원본 변경 금지, 연구자 전자서명", 0.60, "영업비밀"),
        (11, "생산·공급망", "작업일보 분석 및 설비 이상탐지", "실적수집 → KPI 산출 → 이상치 탐지 → 원인후보 → 조치 → 보고", "분석·탐지, 예측·최적화", "현장 안전 엔지니어 승인, 오탐율 모니터링", 0.70, "내부용"),
        (12, "생산·공급망", "수요·재고 최적화 분석", "수요수집 → 데이터정제 → 예측 → 재고정책 → 시나리오 → 승인", "예측·최적화, 추천·의사결정", "최소 안전재고 보장, 공급망 책임자 승인", 0.65, "대외비"),
        (13, "생산·공급망", "공급사 견적 비교 및 리스크 평가", "요건정리 → 견적추출 → 동등조건화 → 비교 → 리스크 → 승인", "분류·추출, 분석·탐지", "구매 단가 보안, 공급사 평가 공정성 유지", 0.70, "대외비"),
        (14, "품질·규제", "규제·품질 문서 검토", "문서수신 → 요건매핑 → 누락/불일치 → 의견초안 → 전문가검토 → 승인", "요약·작성, 검색/RAG", "GxP 규정 준수, 품질책임자 최종 서명 필수", 0.55, "엄격통제"),
        (15, "품질·규제", "이탈/CAPA 보고서 초안", "사실수집 → 분류 → 원인분석 → 조치후보 → 효과확인계획 → 승인", "요약·작성, 추천·의사결정", "원인 분석 타당성 QA 검증, 시정조치 추적", 0.50, "엄격통제"),
        (16, "품질·규제", "감사 증적 수집 및 준비", "요구목록 → 증적검색 → 적합성검토 → 갭분석 → 보완 → 제출", "검색/RAG, 분류·추출", "증적 원본 해시 검증, 미제출 항목 경고", 0.65, "대외비"),
        (17, "영업·마케팅·고객", "고객 맞춤형 제안서 초안", "요구파악 → 자료검색 → 구조설계 → 초안 → 가격/법무검토 → 제출", "요약·작성, 검색/RAG", "최종 단가 및 법적 확약 영업임원 승인", 0.60, "대외비"),
        (18, "영업·마케팅·고객", "고객의 소리(VOC) 분석", "수집 → 비식별/정제 → 분류 → 추세 → 원인 → 개선우선순위 → 보고", "분류·추출, 분석·탐지", "고객 개인식별정보 자동 비식별화 필수", 0.80, "내부용"),
        (19, "영업·마케팅·고객", "고객 다채널 문의 처리", "접수 → 의도/긴급도 → 지식검색 → 답변 → 품질검토 → 기록", "검색/RAG, Agent/Workflow", "오답 시 즉시 상담원 전환, 응대 로그 전수 기록", 0.75, "보통"),
        (20, "재무·법무", "월마감 재무 분석", "원장추출 → 계정검증 → 증감분석 → 이상항목 → 설명초안 → 보고", "분석·탐지, 요약·작성", "원장 수정 권한 차단, 재무팀장 최종 승인", 0.65, "기밀"),
        (21, "재무·법무", "비용 정산 및 영수증 검토", "증빙추출 → 정책대조 → 예외탐지 → 보완요청 → 승인 → 전표", "분류·추출, 분석·탐지", "부정 청구 룰 검증, 결재권자 승인 결재선", 0.80, "내부용"),
        (22, "재무·법무", "계약서 위험 조항 검토", "문서수신 → 조항분류 → 표준비교 → 위험표시 → 수정의견 → 법무승인", "검색/RAG, 요약·작성", "법무팀 변호사/법무담당자 최종 승인 필수", 0.50, "기밀"),
        (23, "인사·총무", "신규 입사자 온보딩 안내", "입사정보 → 역할별자료 → 계정/교육 → 안내 → 완료추적 → 문의응대", "검색/RAG, Agent/Workflow", "인사정보 열람 권한 제한, 온보딩 체크리스트", 0.75, "개인정보"),
        (24, "인사·총무", "사내 교육 자료 제작", "요구분석 → 자료수집 → 구조설계 → 초안 → 전문가검토 → 배포", "요약·작성, 검색/RAG", "저작권 및 내부 기밀 유출 여부 검증", 0.70, "내부용"),
        (25, "전략·경영", "경영진 보고 자료 초안", "주제정의 → 데이터수집 → 분석 → 메시지화 → 초안 → 검토 → 배포", "요약·작성, 분석·탐지", "핵심 경영 지표 원천 대조, 보안 배포", 0.55, "극비/기밀"),
        (26, "전략·경영", "회의록 의사결정 및 과제 추적", "자료/회의수집 → 결정추출 → Action Item → 담당/기한 → 추적 → 보고", "요약·작성, Agent/Workflow", "음성/기록 기밀 유지, 담당자 배정 통보", 0.75, "대외비")
    ]

    for r_idx, row in enumerate(templates_data, start=6):
        ws_tmpl.cell(row=r_idx, column=2, value=row[0]).font = Font(name=font_name, size=9.5)
        ws_tmpl.cell(row=r_idx, column=2).alignment = center_align
        ws_tmpl.cell(row=r_idx, column=3, value=row[1]).font = Font(name=font_name, size=9.5, bold=True)
        ws_tmpl.cell(row=r_idx, column=4, value=row[2]).font = Font(name=font_name, size=9.5, bold=True, color="1E3A8A")
        ws_tmpl.cell(row=r_idx, column=5, value=row[3]).font = Font(name=font_name, size=9)
        ws_tmpl.cell(row=r_idx, column=6, value=row[4]).font = Font(name=font_name, size=9.5)
        ws_tmpl.cell(row=r_idx, column=7, value=row[5]).font = Font(name=font_name, size=9)
        
        c_auto = ws_tmpl.cell(row=r_idx, column=8, value=row[6])
        c_auto.font = Font(name=font_name, size=9.5)
        c_auto.number_format = FMT_PERCENT
        c_auto.alignment = right_align

        c_sec = ws_tmpl.cell(row=r_idx, column=9, value=row[7])
        c_sec.font = Font(name=font_name, size=9.5)
        c_sec.alignment = center_align

        for c_i in range(2, 10):
            ws_tmpl.cell(row=r_idx, column=c_i).border = cell_border
            if r_idx % 2 == 1:
                ws_tmpl.cell(row=r_idx, column=c_i).fill = zebra_fill

    ws_tmpl.column_dimensions['A'].width = 3
    ws_tmpl.column_dimensions['B'].width = 6
    ws_tmpl.column_dimensions['C'].width = 18
    ws_tmpl.column_dimensions['D'].width = 30
    ws_tmpl.column_dimensions['E'].width = 52
    ws_tmpl.column_dimensions['F'].width = 24
    ws_tmpl.column_dimensions['G'].width = 44
    ws_tmpl.column_dimensions['H'].width = 15
    ws_tmpl.column_dimensions['I'].width = 15

    # ==========================================
    # 3. Sheet: 02_포트폴리오_관리대장
    # ==========================================
    ws_pf = wb.create_sheet(title="02_포트폴리오_관리대장")
    ws_pf.views.sheetView[0].showGridLines = True

    ws_pf['B2'] = "■ AX 과제 포트폴리오 관리대장 (Layer 1 - PRD 제7장 & 제10장)"
    ws_pf['B2'].font = title_font
    ws_pf['B3'] = "전사 AX 과제 통합 라이프사이클 관리 (G0~G6 게이트, 종합 우선순위 평가, 재무 지표 및 위험 거버넌스)"
    ws_pf['B3'].font = subtitle_font

    pf_headers = [
        "과제 ID", "과제명", "주관 조직", "업무 소유자", "단계 (Stage)", "게이트 (Gate)", "위험 등급",
        "가치\n(1~5)", "실현성\n(1~5)", "전략정렬\n(1~5)", "재사용성\n(1~5)", "리스크/노력\n(1~5)", "우선순위 점수\n(10점 만점)",
        "연간 총편익\n(천원)", "연간 TCO\n(천원)", "연간 순편익\n(천원)", "3년 누적 TCO\n(천원)", "3년 ROI\n(%)", "투자회수기간\n(개월)", "승인 상태"
    ]
    for c_i, h in enumerate(pf_headers, start=2):
        c = ws_pf.cell(row=5, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    sample_cases = [
        ("UC-2026-001", "주간 장애 및 운영 보고 자동화", "정보기술·데이터", "김인프라 팀장", "Pilot", "G4 통과", "Tier 2 (보통)", 4.5, 4.2, 4.0, 4.0, 2.0, "Approved"),
        ("UC-2026-002", "계약서 위험 조항 사전 검토", "재무·법무", "이법무 수석", "Assessment", "G2 대기", "Tier 1 (고위험)", 4.8, 3.5, 4.5, 3.8, 3.2, "Reviewing"),
        ("UC-2026-003", "고객 다채널 지능형 상담 어시스턴트", "영업·마케팅·고객", "박고객 팀장", "PoC", "G3 통과", "Tier 2 (보통)", 4.6, 4.0, 4.8, 4.2, 2.8, "Approved"),
        ("UC-2026-004", "공급사 견적 비교 및 단가 분석", "생산·공급망", "최구매 수석", "Screening", "G1 대기", "Tier 3 (저위험)", 3.8, 4.2, 3.5, 3.0, 1.8, "Submitted"),
        ("UC-2026-005", "비용 정산 및 증빙 적격성 검토", "재무·법무", "정회계 팀장", "Production", "G5 운영", "Tier 3 (저위험)", 4.2, 4.6, 3.8, 4.0, 1.5, "In-Ops"),
        ("UC-2026-006", "규제·품질 문서 정합성 점검", "품질·규제", "강품질 실장", "Assessment", "G2 대기", "Tier 1 (고위험)", 4.7, 3.2, 4.6, 3.5, 3.5, "Conditional"),
        ("UC-2026-007", "신규 입사자 온보딩 AI 가이드", "인사·총무", "윤인사 파트장", "Optimize", "G6 가치검증", "Tier 3 (저위험)", 3.5, 4.8, 3.2, 3.5, 1.2, "In-Ops"),
        ("UC-2026-008", "보안 경보(SIEM) 1차 분석 자동화", "보안·개인정보", "조보안 팀장", "PoC", "G3 통과", "Tier 1 (고위험)", 4.9, 3.6, 4.9, 4.5, 3.0, "Approved"),
        ("UC-2026-009", "연구 논문 및 특허 선행 기술 분석", "연구개발", "한연구 수석", "Screening", "G1 대기", "Tier 2 (보통)", 4.3, 3.8, 4.4, 3.6, 2.2, "Submitted"),
        ("UC-2026-010", "회의 의사결정 추출 및 Action 추적", "전략·경영", "오전략 팀장", "Pilot", "G4 대기", "Tier 3 (저위험)", 3.9, 4.4, 3.7, 3.8, 1.6, "Approved")
    ]

    for idx, case in enumerate(sample_cases, start=6):
        ws_pf.cell(row=idx, column=2, value=case[0]).alignment = center_align # ID
        ws_pf.cell(row=idx, column=3, value=case[1]).font = Font(name=font_name, size=9.5, bold=True) # Title
        ws_pf.cell(row=idx, column=4, value=case[2]).alignment = center_align # Org
        ws_pf.cell(row=idx, column=5, value=case[3]).alignment = center_align # Owner
        ws_pf.cell(row=idx, column=6, value=case[4]).alignment = center_align # Stage
        ws_pf.cell(row=idx, column=7, value=case[5]).alignment = center_align # Gate
        
        # Risk Tier
        c_risk = ws_pf.cell(row=idx, column=8, value=case[6])
        c_risk.alignment = center_align
        if "Tier 1" in case[6]: c_risk.font = Font(name=font_name, size=9.5, bold=True, color="DC2626")
        elif "Tier 2" in case[6]: c_risk.font = Font(name=font_name, size=9.5, color="D97706")
        else: c_risk.font = Font(name=font_name, size=9.5, color="16A34A")

        # Scores (Input)
        for s_i, sc in enumerate([case[7], case[8], case[9], case[10], case[11]], start=9):
            c_s = ws_pf.cell(row=idx, column=s_i, value=sc)
            c_s.font = input_font; c_s.fill = input_fill; c_s.number_format = FMT_NUMBER; c_s.alignment = right_align

        # Priority score Formula: (Value*0.3 + Feasibility*0.25 + Alignment*0.2 + Reuse*0.15) - (Risk*0.2) + 2.0 (scale to 10)
        c_prio = ws_pf.cell(row=idx, column=14)
        c_prio.value = f"=ROUND((I{idx}*0.30 + J{idx}*0.25 + K{idx}*0.20 + L{idx}*0.15) - (M{idx}*0.20) + 2.0, 1)"
        c_prio.font = bold_formula_font; c_prio.alignment = right_align; c_prio.number_format = FMT_NUMBER

        # Financial Columns:
        # Row 6 (UC-2026-001) links directly to detailed sheets 04, 05, 06!
        if idx == 6:
            # Linked formulas
            ws_pf.cell(row=idx, column=15, value="='05_편익_5대항목_산정'!D30").font = link_font # Year 1 Benefit
            ws_pf.cell(row=idx, column=16, value="='04_TCO_8대비용군_산정'!F36").font = link_font # Year 1 TCO
            ws_pf.cell(row=idx, column=17, value=f"=O{idx}-P{idx}").font = bold_formula_font     # Net Annual Benefit
            ws_pf.cell(row=idx, column=18, value="='04_TCO_8대비용군_산정'!G36").font = link_font # 3Y Cumulative TCO
            ws_pf.cell(row=idx, column=19, value="='06_ROI_현금흐름_시뮬레이터'!D15").font = link_font # 3Y ROI %
            ws_pf.cell(row=idx, column=20, value="='06_ROI_현금흐름_시뮬레이터'!D17").font = link_font # Payback Months
        else:
            # Modeled estimates for portfolio view
            base_ben = [0, 0, 115000, 185000, 72000, 94000, 128000, 52000, 165000, 88000, 64000][idx-5]
            base_tco_y1 = [0, 0, 48000, 62000, 28000, 32000, 55000, 19000, 58000, 35000, 24000][idx-5]
            base_tco_3y = [0, 0, 86000, 118000, 54000, 61000, 102000, 36000, 112000, 68000, 46000][idx-5]

            c_ben = ws_pf.cell(row=idx, column=15, value=base_ben); c_ben.font = input_font; c_ben.fill = input_fill
            c_tco = ws_pf.cell(row=idx, column=16, value=base_tco_y1); c_tco.font = input_font; c_tco.fill = input_fill
            c_net = ws_pf.cell(row=idx, column=17, value=f"=O{idx}-P{idx}"); c_net.font = formula_font
            c_3tco = ws_pf.cell(row=idx, column=18, value=base_tco_3y); c_3tco.font = input_font; c_3tco.fill = input_fill
            
            # ROI: (3Y Ben - 3Y TCO)/3Y TCO
            c_roi = ws_pf.cell(row=idx, column=19, value=f"=IF(R{idx}>0, (O{idx}*3 - R{idx})/R{idx}, \"계산 불가\")")
            c_roi.font = bold_formula_font

            # Payback months: Guard against non-positive monthly net benefit
            c_pb = ws_pf.cell(row=idx, column=20, value=f'=IF(Q{idx}<=0, "회수 불가", ROUND(R{idx}/(Q{idx}/12), 1))')
            c_pb.font = bold_formula_font

        # Number formatting for financial cols
        for c_col in [15, 16, 17, 18]:
            ws_pf.cell(row=idx, column=c_col).number_format = FMT_CURRENCY
            ws_pf.cell(row=idx, column=c_col).alignment = right_align
        ws_pf.cell(row=idx, column=19).number_format = FMT_PERCENT
        ws_pf.cell(row=idx, column=19).alignment = right_align
        ws_pf.cell(row=idx, column=20).alignment = right_align

        # Approval status
        c_app = ws_pf.cell(row=idx, column=21, value=case[12])
        c_app.alignment = center_align
        c_app.font = Font(name=font_name, size=9.5, bold=True, color="15803D" if case[12] in ["Approved", "In-Ops"] else "D97706")

        for c_i in range(2, 22):
            ws_pf.cell(row=idx, column=c_i).border = cell_border
            if idx % 2 == 1 and idx != 6:
                ws_pf.cell(row=idx, column=c_i).fill = zebra_fill

    # Portfolio Summary Total Row
    tot_r = 16
    ws_pf.cell(row=tot_r, column=2, value="합계 / 전사 평균").font = Font(name=font_name, size=10, bold=True, color="1E293B")
    ws_pf.cell(row=tot_r, column=2).alignment = center_align
    
    # Average priority
    ws_pf.cell(row=tot_r, column=14, value=f"=AVERAGE(N6:N15)").number_format = FMT_NUMBER
    ws_pf.cell(row=tot_r, column=14).font = bold_formula_font; ws_pf.cell(row=tot_r, column=14).alignment = right_align

    # Sum of Annual Benefit, TCO, Net Benefit, 3Y TCO
    for c_idx in [15, 16, 17, 18]:
        c_tot = ws_pf.cell(row=tot_r, column=c_idx, value=f"=SUM({get_column_letter(c_idx)}6:{get_column_letter(c_idx)}15)")
        c_tot.font = kpi_highlight_font
        c_tot.number_format = FMT_CURRENCY
        c_tot.alignment = right_align

    # Portfolio Overall 3Y ROI: (Sum(Benefit*3) - Sum(3Y TCO)) / Sum(3Y TCO)
    c_tot_roi = ws_pf.cell(row=tot_r, column=19, value=f"=IF(R{tot_r}>0, (O{tot_r}*3 - R{tot_r})/R{tot_r}, 0)")
    c_tot_roi.font = kpi_highlight_font
    c_tot_roi.number_format = FMT_PERCENT
    c_tot_roi.alignment = right_align

    # Average Payback
    c_tot_pb = ws_pf.cell(row=tot_r, column=20, value=f'=IF(Q{tot_r}<=0, "회수 불가", ROUND(R{tot_r}/(Q{tot_r}/12), 1))')
    c_tot_pb.font = kpi_highlight_font
    c_tot_pb.alignment = right_align

    for c_i in range(2, 22):
        ws_pf.cell(row=tot_r, column=c_i).border = total_border
        ws_pf.cell(row=tot_r, column=c_i).fill = total_fill

    # Set Column widths
    pf_col_widths = {2: 14, 3: 32, 4: 18, 5: 14, 6: 14, 7: 12, 8: 15, 9: 10, 10: 10, 11: 10, 12: 10, 13: 12, 14: 14, 15: 16, 16: 16, 17: 16, 18: 16, 19: 14, 20: 16, 21: 14}
    for c_num, width in pf_col_widths.items():
        ws_pf.column_dimensions[get_column_letter(c_num)].width = width
    ws_pf.column_dimensions['A'].width = 3

    # ==========================================
    # 4. Sheet: 03_워크플로우_세부분석
    # ==========================================
    ws_wf = wb.create_sheet(title="03_워크플로우_세부분석")
    ws_wf.views.sheetView[0].showGridLines = True

    ws_wf['B2'] = "■ 과제 워크플로우 단계별 세부분석 (PRD 제6장 및 9.2절)"
    ws_wf['B2'].font = title_font
    ws_wf['B3'] = "대상 과제: [UC-2026-001] 주간 장애 및 운영 보고 자동화 (IT 운영 조직)"
    ws_wf['B3'].font = subtitle_font

    # Metadata cards
    ws_wf['B5'] = "업무명"; ws_wf['C5'] = "주간 장애 및 운영 보고"; ws_wf['E5'] = "업무 소유자"; ws_wf['F5'] = "김인프라 팀장 (IT운영팀)"
    ws_wf['B6'] = "업무 주기"; ws_wf['C6'] = "매주 금요일 (월 4회)"; ws_wf['E6'] = "참여 인력 수"; ws_wf['F6'] = 3
    for r in [5, 6]:
        for c in [2, 5]:
            ws_wf.cell(row=r, column=c).font = sub_header_font
            ws_wf.cell(row=r, column=c).fill = sub_header_fill
            ws_wf.cell(row=r, column=c).border = cell_border
        for c in [3, 6]:
            ws_wf.cell(row=r, column=c).font = Font(name=font_name, size=10)
            ws_wf.cell(row=r, column=c).border = cell_border
    ws_wf['F6'].font = input_font; ws_wf['F6'].fill = input_fill; ws_wf['F6'].alignment = right_align

    # Step table headers
    wf_headers = [
        "단계 No", "프로세스 단계명", "담당 역할", "대상 시스템", "AI 적용 패턴",
        "기준 시간\n(분/건)", "월간 건수\n(건/월)", "참여 인원\n(명)", "AS-IS 기준시간\n(시간/월)",
        "자동화율\n(%)", "잔류인간시간\n(분/건)", "검토율\n(%)", "검토시간\n(분/건)",
        "실패율\n(%)", "예외처리시간\n(분/건)", "재작업율\n(%)", "재작업시간\n(분/건)",
        "TO-BE 시간\n(분/건)", "건당 절감시간\n(분/건)", "월간 총 절감\n(시간/월)"
    ]
    for c_i, h in enumerate(wf_headers, start=2):
        c = ws_wf.cell(row=8, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    steps_data = [
        ("Step 1", "다중 소스 로그 및 티켓 데이터 수집", "IT 운영 담당자", "ITSM, Zabbix, AWS CloudWatch", "분류·추출 / Agent", 90, 4, 3, 0.85, 0.20, 0.05, 0.05),
        ("Step 2", "장애 영향도 및 서비스 중단 분석", "서비스 엔지니어", "ITSM, 서비스 카탈로그", "분석·탐지", 75, 4, 3, 0.75, 0.25, 0.08, 0.05),
        ("Step 3", "근본 원인 및 조치 내역 정리", "시스템 아키텍트", "Wiki, Jira, ITSM", "검색/RAG, 요약", 120, 4, 3, 0.70, 0.30, 0.05, 0.08),
        ("Step 4", "경영진 보고서 초안 생성", "운영 기획자", "M365, 사내 보고서 템플릿", "요약·작성 (LLM)", 80, 4, 3, 0.80, 0.25, 0.05, 0.05),
        ("Step 5", "전문가/팀장 검토 및 수정 (HITL)", "IT 운영팀장", "사내 결재 포털", "Human-in-the-Loop", 60, 4, 1, 0.20, 0.80, 0.02, 0.05),
        ("Step 6", "경영진 최종 보고 및 유관부서 배포", "운영 기획자", "Outlook, 메일링 시스템", "Agent/Workflow", 45, 4, 2, 0.70, 0.20, 0.03, 0.02)
    ]

    for s_idx, step in enumerate(steps_data, start=9):
        ws_wf.cell(row=s_idx, column=2, value=step[0]).alignment = center_align
        ws_wf.cell(row=s_idx, column=3, value=step[1]).font = Font(name=font_name, size=9.5, bold=True)
        ws_wf.cell(row=s_idx, column=4, value=step[2]).alignment = center_align
        ws_wf.cell(row=s_idx, column=5, value=step[3]).alignment = left_align
        ws_wf.cell(row=s_idx, column=6, value=step[4]).alignment = center_align

        # Base inputs: Minutes (G), Volume (H), People (I)
        c_min = ws_wf.cell(row=s_idx, column=7, value=step[5]); c_min.font = input_font; c_min.fill = input_fill; c_min.alignment = right_align; c_min.number_format = FMT_INT
        c_vol = ws_wf.cell(row=s_idx, column=8, value=step[6]); c_vol.font = input_font; c_vol.fill = input_fill; c_vol.alignment = right_align; c_vol.number_format = FMT_INT
        c_peo = ws_wf.cell(row=s_idx, column=9, value=step[7]); c_peo.font = input_font; c_peo.fill = input_fill; c_peo.alignment = right_align; c_peo.number_format = FMT_INT

        # AS-IS Baseline Hours = G * H * I / 60
        c_ashours = ws_wf.cell(row=s_idx, column=10, value=f"=G{s_idx}*H{s_idx}*I{s_idx}/60")
        c_ashours.font = bold_formula_font; c_ashours.alignment = right_align; c_ashours.number_format = FMT_NUMBER

        # Automation Rate (K - Input)
        c_auto = ws_wf.cell(row=s_idx, column=11, value=step[8]); c_auto.font = input_font; c_auto.fill = input_fill; c_auto.alignment = right_align; c_auto.number_format = FMT_PERCENT

        # Human Residual = G * (1 - K)
        c_res = ws_wf.cell(row=s_idx, column=12, value=f"=G{s_idx}*(1-K{s_idx})")
        c_res.font = formula_font; c_res.alignment = right_align; c_res.number_format = FMT_NUMBER

        # Review Rate (M - Input)
        c_rev_rate = ws_wf.cell(row=s_idx, column=13, value=step[9]); c_rev_rate.font = input_font; c_rev_rate.fill = input_fill; c_rev_rate.alignment = right_align; c_rev_rate.number_format = FMT_PERCENT

        # Review Time = G * K * M
        c_rev_time = ws_wf.cell(row=s_idx, column=14, value=f"=G{s_idx}*K{s_idx}*M{s_idx}")
        c_rev_time.font = formula_font; c_rev_time.alignment = right_align; c_rev_time.number_format = FMT_NUMBER

        # Failure/Exception Rate (O - Input)
        c_fail_rate = ws_wf.cell(row=s_idx, column=15, value=step[10]); c_fail_rate.font = input_font; c_fail_rate.fill = input_fill; c_fail_rate.alignment = right_align; c_fail_rate.number_format = FMT_PERCENT

        # Exception Handling Time = G * O * 0.5 (ratio)
        c_fail_time = ws_wf.cell(row=s_idx, column=16, value=f"=G{s_idx}*O{s_idx}*0.5")
        c_fail_time.font = formula_font; c_fail_time.alignment = right_align; c_fail_time.number_format = FMT_NUMBER

        # Rework Rate (Q - Input)
        c_rew_rate = ws_wf.cell(row=s_idx, column=17, value=step[11]); c_rew_rate.font = input_font; c_rew_rate.fill = input_fill; c_rew_rate.alignment = right_align; c_rew_rate.number_format = FMT_PERCENT

        # Rework Time = Q * 20 (avg rework mins)
        c_rew_time = ws_wf.cell(row=s_idx, column=18, value=f"=Q{s_idx}*20")
        c_rew_time.font = formula_font; c_rew_time.alignment = right_align; c_rew_time.number_format = FMT_NUMBER

        # TO-BE Time = L + N + P + R
        c_tobe = ws_wf.cell(row=s_idx, column=19, value=f"=L{s_idx}+N{s_idx}+P{s_idx}+R{s_idx}")
        c_tobe.font = bold_formula_font; c_tobe.alignment = right_align; c_tobe.number_format = FMT_NUMBER

        # Net Minutes Saved = G - S
        c_saved_min = ws_wf.cell(row=s_idx, column=20, value=f"=G{s_idx}-S{s_idx}")
        c_saved_min.font = bold_formula_font; c_saved_min.alignment = right_align; c_saved_min.number_format = FMT_NUMBER

        # Net Hours Saved / Mo = T * H * I / 60
        c_saved_hrs = ws_wf.cell(row=s_idx, column=21, value=f"=T{s_idx}*H{s_idx}*I{s_idx}/60")
        c_saved_hrs.font = kpi_highlight_font; c_saved_hrs.alignment = right_align; c_saved_hrs.number_format = FMT_NUMBER

        for c_i in range(2, 22):
            ws_wf.cell(row=s_idx, column=c_i).border = cell_border
            if s_idx % 2 == 1:
                ws_wf.cell(row=s_idx, column=c_i).fill = zebra_fill

    # Total Row for Workflow
    tot_wf = 15
    ws_wf.cell(row=tot_wf, column=2, value="합계 / 가중평균").font = Font(name=font_name, size=10, bold=True)
    ws_wf.cell(row=tot_wf, column=2).alignment = center_align
    
    # Sum of AS-IS Minutes & Hours
    ws_wf.cell(row=tot_wf, column=7, value=f"=SUM(G9:G14)").number_format = FMT_INT
    ws_wf.cell(row=tot_wf, column=7).font = bold_formula_font; ws_wf.cell(row=tot_wf, column=7).alignment = right_align

    ws_wf.cell(row=tot_wf, column=10, value=f"=SUM(J9:J14)").number_format = FMT_NUMBER
    ws_wf.cell(row=tot_wf, column=10).font = kpi_highlight_font; ws_wf.cell(row=tot_wf, column=10).alignment = right_align

    # Average Automation Rate: Weighted by baseline minutes
    ws_wf.cell(row=tot_wf, column=11, value=f"=SUMPRODUCT(G9:G14, K9:K14)/G{tot_wf}").number_format = FMT_PERCENT
    ws_wf.cell(row=tot_wf, column=11).font = bold_formula_font; ws_wf.cell(row=tot_wf, column=11).alignment = right_align

    # Sum of TO-BE Minutes
    ws_wf.cell(row=tot_wf, column=19, value=f"=SUM(S9:S14)").number_format = FMT_NUMBER
    ws_wf.cell(row=tot_wf, column=19).font = bold_formula_font; ws_wf.cell(row=tot_wf, column=19).alignment = right_align

    # Sum of Net Minutes Saved
    ws_wf.cell(row=tot_wf, column=20, value=f"=SUM(T9:T14)").number_format = FMT_NUMBER
    ws_wf.cell(row=tot_wf, column=20).font = bold_formula_font; ws_wf.cell(row=tot_wf, column=20).alignment = right_align

    # Grand Total Net Hours Saved / Mo
    c_final_saved = ws_wf.cell(row=tot_wf, column=21, value=f"=SUM(U9:U14)")
    c_final_saved.font = kpi_highlight_font; c_final_saved.number_format = FMT_NUMBER; c_final_saved.alignment = right_align

    for c_i in range(2, 22):
        ws_wf.cell(row=tot_wf, column=c_i).border = total_border
        ws_wf.cell(row=tot_wf, column=c_i).fill = total_fill

    # Set Column widths
    wf_col_widths = {2: 12, 3: 32, 4: 16, 5: 26, 6: 18, 7: 13, 8: 12, 9: 12, 10: 16, 11: 13, 12: 14, 13: 13, 14: 14, 15: 13, 16: 15, 17: 13, 18: 15, 19: 14, 20: 15, 21: 18}
    for c_num, width in wf_col_widths.items():
        ws_wf.column_dimensions[get_column_letter(c_num)].width = width
    ws_wf.column_dimensions['A'].width = 3

    # ==========================================
    # 5. Sheet: 04_TCO_8대비용군_산정
    # ==========================================
    ws_tco = wb.create_sheet(title="04_TCO_8대비용군_산정")
    ws_tco.views.sheetView[0].showGridLines = True

    ws_tco['B2'] = "■ 과제 생애주기 총소유비용 (TCO) 8대 비용군 상세 산정 (PRD 9.1절)"
    ws_tco['B2'].font = title_font
    ws_tco['B3'] = "TCO(H) = OneTimeCost + Sum(month=1..H)[RunCost + ChangeCost + ControlCost + SharedCostAllocated] + ExitCost (단위: 천원)"
    ws_tco['B3'].font = subtitle_font

    tco_headers = ["비용 대분류 (Cost Group)", "세부 비용 항목 (Cost Items)", "비용 성격", "초기 1회 비용\n(One-time, 천원)", "월간 반복 비용\n(Recurring/Mo, 천원)", "1개년 TCO\n(Year 1, 천원)", "3개년 TCO\n(Year 3, 천원)", "5개년 TCO\n(Year 5, 천원)", "산출 근거 및 비고"]
    for c_i, h in enumerate(tco_headers, start=2):
        c = ws_tco.cell(row=5, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    tco_items = [
        # 1. 발견·설계
        ("1. 발견·설계 비용", "현행 프로세스 및 티켓 데이터 수집/정제 분석", "One-Time", 3500, 0, "도메인 실무자 워크숍 및 로그 데이터 전처리"),
        ("1. 발견·설계 비용", "AI 아키텍처 설계 및 보안/규제 적합성 검토", "One-Time", 2500, 0, "보안 거버넌스 및 클라우드 VPC 연계 설계"),
        
        # 2. 구축·통합
        ("2. 구축·통합 비용", "로그 파서 및 이상탐지 알고리즘/Agent 개발", "One-Time", 8500, 0, "Zabbix/CloudWatch 커넥터 및 Agent 개발"),
        ("2. 구축·통합 비용", "M365/사내 결재 포털 API 연계 및 테스트", "One-Time", 4000, 0, "ERP/ITSM 결재선 연동 및 단위/통합 테스트"),
        ("2. 구축·통합 비용", "PoC 환경 구성 및 초기 데이터 파이프라인 마이그레이션", "One-Time", 3000, 0, "PoC 인프라 프로비저닝 및 골든 데이터셋 구축"),
        
        # 3. 플랫폼·사용량
        ("3. 플랫폼·사용량 비용", "LLM API 호출료 (토큰 과금 / GPT-4o, Claude 3.5)", "Monthly Run", 0, 450, "주당 4회 리포트 초안 생성 및 RAG 토큰 비용"),
        ("3. 플랫폼·사용량 비용", "벡터 DB 및 문서 임베딩 인프라 비용", "Monthly Run", 0, 180, "Pinecone / Qdrant 사내 인스턴스 호스팅"),
        ("3. 플랫폼·사용량 비용", "클라우드 컴퓨팅 및 스토리지 (AWS VPC)", "Monthly Run", 0, 320, "Agent 실행 컨테이너 및 로그 저장 S3"),
        
        # 4. 운영·유지보수
        ("4. 운영·유지보수 비용", "프롬프트 최적화, 모델 성능 모니터링 및 드리프트 점검", "Monthly Run", 0, 350, "주간 성능 평가 및 프롬프트 지속 튜닝"),
        ("4. 운영·유지보수 비용", "장애 대응, 헬프데스크 지원 및 벤더 SLA 관리", "Monthly Run", 0, 200, "2선 기술 지원 및 패치 관리"),
        
        # 5. 사람·변화관리
        ("5. 사람·변화관리 비용", "현업 운영자/검토자 AI 활용 교육 및 매뉴얼(SOP) 제작", "One-Time", 2000, 0, "SOP 제정 및 부서 내 실무자 2회 핸즈온 교육"),
        ("5. 사람·변화관리 비용", "운영 모니터링 및 변화관리 전담 공수 배부", "Monthly Change", 0, 250, "월 1회 피드백 회고 및 사용자 개선 인터뷰"),
        
        # 6. 통제·컴플라이언스
        ("6. 통제·컴플라이언스 비용", "보안 취약점 점검, 개인정보영향평가 및 침해대응", "One-Time", 1800, 0, "사내 정보보호팀 사전 감사 및 승인 절차"),
        ("6. 통제·컴플라이언스 비용", "감사 증적 수집, AI 윤리/환각 검증 및 정기 감사", "Monthly Control", 0, 150, "분기별 감사 리포트 생성 및 로그 전수 보존"),
        
        # 7. 공통비 배부
        ("7. 공통비 배부 (공통 인프라)", "전사 AI 공통 플랫폼 라이선스 및 CoE 운영비 배부", "Monthly Shared", 0, 300, "전사 사용량 비례 배부 정책 (사용량 5% 비중)"),
        
        # 8. 종료·전환
        ("8. 종료·전환 비용", "계약 종료 시 데이터 반출, 안전 삭제 및 모델 전환", "Exit Cost", 1500, 0, "서비스 종료 또는 차세대 전환 시 아카이빙 비용 (5년차 반영)")
    ]

    for row_i, item in enumerate(tco_items, start=6):
        ws_tco.cell(row=row_i, column=2, value=item[0]).font = Font(name=font_name, size=9.5, bold=True)
        ws_tco.cell(row=row_i, column=3, value=item[1]).font = Font(name=font_name, size=9.5)
        ws_tco.cell(row=row_i, column=4, value=item[2]).alignment = center_align

        # One-time Cost (E)
        c_ot = ws_tco.cell(row=row_i, column=5, value=item[3]); c_ot.font = input_font; c_ot.fill = input_fill; c_ot.number_format = FMT_CURRENCY; c_ot.alignment = right_align
        # Monthly Cost (F)
        c_mc = ws_tco.cell(row=row_i, column=6, value=item[4]); c_mc.font = input_font; c_mc.fill = input_fill; c_mc.number_format = FMT_CURRENCY; c_mc.alignment = right_align

        # Year 1 TCO (G) = E + F*12
        c_y1 = ws_tco.cell(row=row_i, column=7, value=f"=E{row_i}+F{row_i}*12")
        c_y1.font = formula_font; c_y1.number_format = FMT_CURRENCY; c_y1.alignment = right_align

        # Year 3 TCO (H) = E + F*36
        c_y3 = ws_tco.cell(row=row_i, column=8, value=f"=E{row_i}+F{row_i}*36")
        c_y3.font = formula_font; c_y3.number_format = FMT_CURRENCY; c_y3.alignment = right_align

        # Year 5 TCO (I) = E + F*60
        c_y5 = ws_tco.cell(row=row_i, column=9, value=f"=E{row_i}+F{row_i}*60")
        c_y5.font = bold_formula_font; c_y5.number_format = FMT_CURRENCY; c_y5.alignment = right_align

        ws_tco.cell(row=row_i, column=10, value=item[5]).font = Font(name=font_name, size=9, color="475569")

        for c_i in range(2, 11):
            ws_tco.cell(row=row_i, column=c_i).border = cell_border
            if row_i % 2 == 1:
                ws_tco.cell(row=row_i, column=c_i).fill = zebra_fill

    # Total TCO Row
    tot_tco_r = 22
    ws_tco.cell(row=tot_tco_r, column=2, value="총 TCO 합계 (Total TCO)").font = Font(name=font_name, size=10, bold=True)
    ws_tco.cell(row=tot_tco_r, column=2).alignment = center_align

    for c_i in [5, 6, 7, 8, 9]:
        c_t = ws_tco.cell(row=tot_tco_r, column=c_i, value=f"=SUM({get_column_letter(c_i)}6:{get_column_letter(c_i)}21)")
        c_t.font = kpi_highlight_font; c_t.number_format = FMT_CURRENCY; c_t.alignment = right_align

    for c_i in range(2, 11):
        ws_tco.cell(row=tot_tco_r, column=c_i).border = total_border
        ws_tco.cell(row=tot_tco_r, column=c_i).fill = total_fill

    # TCO Summary Box by Category
    ws_tco['B25'] = "■ 8대 비용군별 집계 요약 (Category Summary)"
    ws_tco['B25'].font = section_font

    cat_headers = ["No", "비용군", "초기비용 (One-time)", "월 반복비용 (Recurring/Mo)", "1년 누적 TCO", "3년 누적 TCO", "5년 누적 TCO", "비중 (3Y)"]
    for c_i, h in enumerate(cat_headers, start=2):
        c = ws_tco.cell(row=26, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    cat_ranges = [
        (1, "1. 발견·설계 비용", "6:7"),
        (2, "2. 구축·통합 비용", "8:10"),
        (3, "3. 플랫폼·사용량 비용", "11:13"),
        (4, "4. 운영·유지보수 비용", "14:15"),
        (5, "5. 사람·변화관리 비용", "16:17"),
        (6, "6. 통제·컴플라이언스 비용", "18:19"),
        (7, "7. 공통비 배부 (공통인프라)", "20:20"),
        (8, "8. 종료·전환 비용", "21:21")
    ]

    for idx, (cat_no, cat_name, r_rng) in enumerate(cat_ranges, start=27):
        r_start, r_end = r_rng.split(":")
        ws_tco.cell(row=idx, column=2, value=cat_no).alignment = center_align
        ws_tco.cell(row=idx, column=3, value=cat_name).font = Font(name=font_name, size=9.5, bold=True)
        
        # Initial (D), Monthly (E), Y1 (F), Y3 (G), Y5 (H)
        c_ot = ws_tco.cell(row=idx, column=4, value=f"=SUM(E{r_start}:E{r_end})"); c_ot.font = formula_font; c_ot.number_format = FMT_CURRENCY; c_ot.alignment = right_align
        c_rec = ws_tco.cell(row=idx, column=5, value=f"=SUM(F{r_start}:F{r_end})"); c_rec.font = formula_font; c_rec.number_format = FMT_CURRENCY; c_rec.alignment = right_align
        c_y1 = ws_tco.cell(row=idx, column=6, value=f"=SUM(G{r_start}:G{r_end})"); c_y1.font = formula_font; c_y1.number_format = FMT_CURRENCY; c_y1.alignment = right_align
        c_y3 = ws_tco.cell(row=idx, column=7, value=f"=SUM(H{r_start}:H{r_end})"); c_y3.font = bold_formula_font; c_y3.number_format = FMT_CURRENCY; c_y3.alignment = right_align
        c_y5 = ws_tco.cell(row=idx, column=8, value=f"=SUM(I{r_start}:I{r_end})"); c_y5.font = formula_font; c_y5.number_format = FMT_CURRENCY; c_y5.alignment = right_align
        
        c_pct = ws_tco.cell(row=idx, column=9, value=f"=IF($G$36>0, G{idx}/$G$36, 0)"); c_pct.font = formula_font; c_pct.number_format = FMT_PERCENT; c_pct.alignment = right_align

        for c_i in range(2, 10): ws_tco.cell(row=idx, column=c_i).border = cell_border

    # Summary Row 36
    ws_tco.cell(row=36, column=2, value="총계 (Grand Total)").font = Font(name=font_name, size=10, bold=True)
    ws_tco.cell(row=36, column=2).alignment = center_align
    for c_i in [4, 5, 6, 7, 8]:
        c_s = ws_tco.cell(row=36, column=c_i, value=f"=SUM({get_column_letter(c_i)}27:{get_column_letter(c_i)}34)")
        c_s.font = kpi_highlight_font; c_s.number_format = FMT_CURRENCY; c_s.alignment = right_align
    c_s_pct = ws_tco.cell(row=36, column=9, value=f"=SUM(I27:I34)"); c_s_pct.font = kpi_highlight_font; c_s_pct.number_format = FMT_PERCENT; c_s_pct.alignment = right_align

    for c_i in range(2, 10):
        ws_tco.cell(row=36, column=c_i).border = total_border
        ws_tco.cell(row=36, column=c_i).fill = total_fill

    tco_col_widths = {2: 24, 3: 42, 4: 16, 5: 18, 6: 18, 7: 18, 8: 18, 9: 18, 10: 38}
    for c_num, width in tco_col_widths.items():
        ws_tco.column_dimensions[get_column_letter(c_num)].width = width
    ws_tco.column_dimensions['A'].width = 3

    # ==========================================
    # 6. Sheet: 05_편익_5대항목_산정
    # ==========================================
    ws_ben = wb.create_sheet(title="05_편익_5대항목_산정")
    ws_ben.views.sheetView[0].showGridLines = True

    ws_ben['B2'] = "■ 과제 다차원 편익 5대 항목 상세 산정 (PRD 9.3~9.5절)"
    ws_ben['B2'].font = title_font
    ws_ben['B3'] = "Gross Benefit = 생산성 가치(실현계수 분리) + 직접비용 회피 + 품질비용 절감 + 리스크 조정 편익 + 매출 기여 (단위: 천원)"
    ws_ben['B3'].font = subtitle_font

    # Global Benefit Drivers Box
    ws_ben['B5'] = "■ 핵심 편익 산정 드라이버 (Global Drivers)"
    ws_ben['B5'].font = section_font
    
    drivers = [
        ("사내 IT 인력 평균 시간당 인건비 (천원/시간)", 45.0, FMT_NUMBER, "Blue: 월 45,000원 기준 인건비"),
        ("생산성 편익 실현 계수 (Capacity Realization Rate)", 0.70, FMT_PERCENT, "절감 시간의 70%만 유효 생산성으로 보수적 반영"),
        ("월간 절감 시간 (시간/월, 워크플로우 연동)", "='03_워크플로우_세부분석'!U15", FMT_NUMBER, "Green: 워크플로우 03시트 총 절감시간 수식 연계"),
        ("증적 신뢰도 계수 (Evidence Confidence - B등급)", 0.85, FMT_PERCENT, "표본 측정 및 담당자 검증 데이터 신뢰도"),
        ("편익 실현 확률 (Realization Probability)", 0.90, FMT_PERCENT, "경영진/현업 채택 및 프로세스 안착 확률")
    ]
    for d_i, (d_label, d_val, d_fmt, d_note) in enumerate(drivers, start=6):
        ws_ben.cell(row=d_i, column=2, value=d_label).font = sub_header_font
        ws_ben.cell(row=d_i, column=2).border = cell_border; ws_ben.cell(row=d_i, column=2).fill = sub_header_fill

        c_v = ws_ben.cell(row=d_i, column=4, value=d_val)
        c_v.number_format = d_fmt; c_v.alignment = right_align; c_v.border = cell_border
        if str(d_val).startswith("="):
            c_v.font = link_font
        else:
            c_v.font = input_font; c_v.fill = input_fill

        c_n = ws_ben.cell(row=d_i, column=5, value=d_note)
        c_n.font = Font(name=font_name, size=9, color="475569"); c_n.border = cell_border

    # Benefit 5 Dimensions Table
    ws_ben['B12'] = "■ 5대 편익군 항목별 월간/연간 가치 산출 내역"
    ws_ben['B12'].font = section_font

    ben_headers = ["편익 대분류", "세부 편익 항목", "월간 편익\n(Monthly, 천원)", "1개년 편익\n(Year 1, 천원)", "3개년 편익\n(Year 3, 천원)", "5개년 편익\n(Year 5, 천원)", "산출 공식 및 인정 원칙"]
    for c_i, h in enumerate(ben_headers, start=2):
        c = ws_ben.cell(row=13, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    # 1. 생산성 가치
    r1 = 14
    ws_ben.cell(row=r1, column=2, value="1. 생산성 가치 (Labor Capacity)").font = Font(name=font_name, size=9.5, bold=True)
    ws_ben.cell(row=r1, column=3, value="주간 장애/운영 보고 시간 절감에 따른 생산성 환산 가치").font = Font(name=font_name, size=9.5)
    ws_ben.cell(row=r1, column=4, value="=D8*D6*D7").font = bold_formula_font # Monthly
    ws_ben.cell(row=r1, column=5, value=f"=D{r1}*12").font = formula_font
    ws_ben.cell(row=r1, column=6, value=f"=D{r1}*36").font = bold_formula_font
    ws_ben.cell(row=r1, column=7, value=f"=D{r1}*60").font = formula_font
    ws_ben.cell(row=r1, column=8, value="절감시간 x 단가(4.5만원) x 실현계수(70%) 적용 (고부가가치 업무 전환)").font = Font(name=font_name, size=9, color="475569")

    # 2. 직접 비용 절감
    r2 = 15
    ws_ben.cell(row=r2, column=2, value="2. 직접 비용 절감 (Direct Cost)").font = Font(name=font_name, size=9.5, bold=True)
    ws_ben.cell(row=r2, column=3, value="기존 상용 모니터링 리포트 생성 외주 용역비 절감").font = Font(name=font_name, size=9.5)
    c_d = ws_ben.cell(row=r2, column=4, value=800); c_d.font = input_font; c_d.fill = input_fill # Monthly
    ws_ben.cell(row=r2, column=5, value=f"=D{r2}*12").font = formula_font
    ws_ben.cell(row=r2, column=6, value=f"=D{r2}*36").font = bold_formula_font
    ws_ben.cell(row=r2, column=7, value=f"=D{r2}*60").font = formula_font
    ws_ben.cell(row=r2, column=8, value="외부 IT 리포팅 외주 계약 축소에 따른 실질 지출 절감액").font = Font(name=font_name, size=9, color="475569")

    r3 = 16
    ws_ben.cell(row=r3, column=2, value="2. 직접 비용 절감 (Direct Cost)").font = Font(name=font_name, size=9.5, bold=True)
    ws_ben.cell(row=r3, column=3, value="레거시 보고서 툴 좌석 라이선스 감축").font = Font(name=font_name, size=9.5)
    c_lic = ws_ben.cell(row=r3, column=4, value=350); c_lic.font = input_font; c_lic.fill = input_fill # Monthly
    ws_ben.cell(row=r3, column=5, value=f"=D{r3}*12").font = formula_font
    ws_ben.cell(row=r3, column=6, value=f"=D{r3}*36").font = bold_formula_font
    ws_ben.cell(row=r3, column=7, value=f"=D{r3}*60").font = formula_font
    ws_ben.cell(row=r3, column=8, value="유휴 BI 리포팅 계정 10좌석 회수 (좌석당 3.5만원)").font = Font(name=font_name, size=9, color="475569")

    # 3. 품질 개선 편익
    r4 = 17
    ws_ben.cell(row=r4, column=2, value="3. 품질 개선 편익 (Quality)").font = Font(name=font_name, size=9.5, bold=True)
    ws_ben.cell(row=r4, column=3, value="장애 수치 오기입 및 재작업/보고서 재발행 비용 절감").font = Font(name=font_name, size=9.5)
    c_q = ws_ben.cell(row=r4, column=4, value=650); c_q.font = input_font; c_q.fill = input_fill # Monthly
    ws_ben.cell(row=r4, column=5, value=f"=D{r4}*12").font = formula_font
    ws_ben.cell(row=r4, column=6, value=f"=D{r4}*36").font = bold_formula_font
    ws_ben.cell(row=r4, column=7, value=f"=D{r4}*60").font = formula_font
    ws_ben.cell(row=r4, column=8, value="보고서 오류 발생 시 경영진 보고 정정 및 재작업 소요 비용 감소").font = Font(name=font_name, size=9, color="475569")

    # 4. 리스크 조정 편익
    r5 = 18
    ws_ben.cell(row=r5, column=2, value="4. 리스크 조정 편익 (Risk-Adjusted)").font = Font(name=font_name, size=9.5, bold=True)
    ws_ben.cell(row=r5, column=3, value="장애 누락 및 늑장 보고에 따른 서비스 SLA 위약금/손실 회피").font = Font(name=font_name, size=9.5)
    ws_ben.cell(row=r5, column=4, value=f"=ROUND(((10000 - 1500)/12) * $D$9 * $D$10, 0)").font = bold_formula_font # Monthly
    ws_ben.cell(row=r5, column=5, value=f"=D{r5}*12").font = formula_font
    ws_ben.cell(row=r5, column=6, value=f"=D{r5}*36").font = bold_formula_font
    ws_ben.cell(row=r5, column=7, value=f"=D{r5}*60").font = formula_font
    ws_ben.cell(row=r5, column=8, value="(기준위험손실-잔여위험손실) x 증적신뢰도(85%) x 실현확률(90%) 보수적 산정").font = Font(name=font_name, size=9, color="475569")

    # 5. 매출/기회 편익
    r6 = 19
    ws_ben.cell(row=r6, column=2, value="5. 매출/기회 편익 (Revenue/Opportunity)").font = Font(name=font_name, size=9.5, bold=True)
    ws_ben.cell(row=r6, column=3, value="신속한 장애 원인 공유에 따른 유관 비즈니스 가동시간 증대").font = Font(name=font_name, size=9.5)
    c_rev = ws_ben.cell(row=r6, column=4, value=500); c_rev.font = input_font; c_rev.fill = input_fill # Monthly
    ws_ben.cell(row=r6, column=5, value=f"=D{r6}*12").font = formula_font
    ws_ben.cell(row=r6, column=6, value=f"=D{r6}*36").font = bold_formula_font
    ws_ben.cell(row=r6, column=7, value=f"=D{r6}*60").font = formula_font
    ws_ben.cell(row=r6, column=8, value="MTTR(평균복구시간) 15분 단축에 따른 현업 업무 중단 손실 회피").font = Font(name=font_name, size=9, color="475569")

    for r_idx in range(14, 20):
        for c_idx in [4, 5, 6, 7]:
            ws_ben.cell(row=r_idx, column=c_idx).number_format = FMT_CURRENCY
            ws_ben.cell(row=r_idx, column=c_idx).alignment = right_align
        for c_i in range(2, 9):
            ws_ben.cell(row=r_idx, column=c_i).border = cell_border

    # Total Gross Benefit Row
    tot_ben_r = 20
    ws_ben.cell(row=tot_ben_r, column=2, value="총 편익 합계 (Gross Benefit)").font = Font(name=font_name, size=10, bold=True)
    ws_ben.cell(row=tot_ben_r, column=2).alignment = center_align
    for c_i in [4, 5, 6, 7]:
        c_b = ws_ben.cell(row=tot_ben_r, column=c_i, value=f"=SUM({get_column_letter(c_i)}14:{get_column_letter(c_i)}19)")
        c_b.font = kpi_highlight_font; c_b.number_format = FMT_CURRENCY; c_b.alignment = right_align

    for c_i in range(2, 9):
        ws_ben.cell(row=tot_ben_r, column=c_i).border = total_border
        ws_ben.cell(row=tot_ben_r, column=c_i).fill = total_fill

    # Benefit Category Summary Breakdown Table
    ws_ben['B23'] = "■ 5대 편익군별 구성비 요약 (Benefit Summary)"
    ws_ben['B23'].font = section_font

    b_sum_headers = ["No", "편익군 구분", "연간 가치 (Year 1)", "3개년 누적 가치", "5개년 누적 가치", "편익 비중 (3Y)"]
    for c_i, h in enumerate(b_sum_headers, start=2):
        c = ws_ben.cell(row=24, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    b_cats = [
        (1, "1. 생산성 가치 (Labor Capacity)", 14),
        (2, "2. 직접 비용 절감 (Direct Cost)", "15:16"),
        (3, "3. 품질 개선 편익 (Quality)", 17),
        (4, "4. 리스크 조정 편익 (Risk-Adjusted)", 18),
        (5, "5. 매출/기회 편익 (Revenue/Opportunity)", 19)
    ]
    for idx, (b_no, b_title, r_ref) in enumerate(b_cats, start=25):
        ws_ben.cell(row=idx, column=2, value=b_no).alignment = center_align
        ws_ben.cell(row=idx, column=3, value=b_title).font = Font(name=font_name, size=9.5, bold=True)
        if isinstance(r_ref, int):
            ws_ben.cell(row=idx, column=4, value=f"=E{r_ref}").number_format = FMT_CURRENCY
            ws_ben.cell(row=idx, column=5, value=f"=F{r_ref}").number_format = FMT_CURRENCY
            ws_ben.cell(row=idx, column=6, value=f"=G{r_ref}").number_format = FMT_CURRENCY
        else:
            s_r, e_r = r_ref.split(":")
            ws_ben.cell(row=idx, column=4, value=f"=SUM(E{s_r}:E{e_r})").number_format = FMT_CURRENCY
            ws_ben.cell(row=idx, column=5, value=f"=SUM(F{s_r}:F{e_r})").number_format = FMT_CURRENCY
            ws_ben.cell(row=idx, column=6, value=f"=SUM(G{s_r}:G{e_r})").number_format = FMT_CURRENCY

        ws_ben.cell(row=idx, column=4).font = formula_font; ws_ben.cell(row=idx, column=4).alignment = right_align
        ws_ben.cell(row=idx, column=5).font = bold_formula_font; ws_ben.cell(row=idx, column=5).alignment = right_align
        ws_ben.cell(row=idx, column=6).font = formula_font; ws_ben.cell(row=idx, column=6).alignment = right_align

        # Percentage relative to 3Y Grand Total (E30 is 3Y total)
        c_p = ws_ben.cell(row=idx, column=7, value=f"=IF($E$30>0, E{idx}/$E$30, 0)")
        c_p.font = formula_font; c_p.number_format = FMT_PERCENT; c_p.alignment = right_align

        for c_i in range(2, 8): ws_ben.cell(row=idx, column=c_i).border = cell_border

    # Grand total summary row 30:
    # Column D: Year 1 Total, Column E: Year 3 Total, Column F: Year 5 Total
    ws_ben.cell(row=30, column=2, value="총계 (Grand Total)").font = Font(name=font_name, size=10, bold=True)
    ws_ben.cell(row=30, column=2).alignment = center_align
    for c_i in [4, 5, 6]:
        c_s = ws_ben.cell(row=30, column=c_i, value=f"=SUM({get_column_letter(c_i)}25:{get_column_letter(c_i)}29)")
        c_s.font = kpi_highlight_font; c_s.number_format = FMT_CURRENCY; c_s.alignment = right_align
    c_s_p = ws_ben.cell(row=30, column=7, value=f"=SUM(G25:G29)"); c_s_p.font = kpi_highlight_font; c_s_p.number_format = FMT_PERCENT; c_s_p.alignment = right_align

    for c_i in range(2, 8):
        ws_ben.cell(row=30, column=c_i).border = total_border
        ws_ben.cell(row=30, column=c_i).fill = total_fill

    ben_col_widths = {2: 24, 3: 42, 4: 18, 5: 18, 6: 18, 7: 18, 8: 48}
    for c_num, width in ben_col_widths.items():
        ws_ben.column_dimensions[get_column_letter(c_num)].width = width
    ws_ben.column_dimensions['A'].width = 3

    # ==========================================
    # 7. Sheet: 06_ROI_현금흐름_시뮬레이터
    # ==========================================
    ws_sim = wb.create_sheet(title="06_ROI_현금흐름_시뮬레이터")
    ws_sim.views.sheetView[0].showGridLines = True

    ws_sim['B2'] = "■ AI ROI & 현금흐름 다차원 시뮬레이터 (PRD 제8장 & 제9장)"
    ws_sim['B2'].font = title_font
    ws_sim['B3'] = "36개월 월별 현금흐름 모델, 회수기간 가드, 3대 시나리오(보수적/기준/공격적) 및 민감도 분석"
    ws_sim['B3'].font = subtitle_font

    # Financial Assumptions Block
    ws_sim['B5'] = "■ 재무 평가 기준 변수 (Financial Assumptions)"
    ws_sim['B5'].font = section_font

    fin_params = [
        ("연간 자본비용 / 할인율 (Annual Discount Rate - WACC)", 0.08, FMT_PERCENT, "재무팀 승인 연 8.0% (월 0.667%)"),
        ("초기 투자비 (One-time Initial Cost, 천원)", "='04_TCO_8대비용군_산정'!D36", FMT_CURRENCY, "Green: TCO 시트 초기비용 합계 참조"),
        ("월간 반복 TCO (Monthly Run TCO, 천원)", "='04_TCO_8대비용군_산정'!E36", FMT_CURRENCY, "Green: TCO 시트 월간비용 합계 참조"),
        ("월간 총 편익 (Monthly Gross Benefit, 천원)", "='05_편익_5대항목_산정'!D20", FMT_CURRENCY, "Green: 편익 시트 월간편익 합계 참조"),
        ("월간 순편익 (Net Monthly Benefit, 천원)", "=D9-D8", FMT_CURRENCY, "Black: 월간 편익 - 월간 반복 TCO"),
        ("평가 분석 기간 (Horizon)", "36 개월 (3년)", "@", "표준 IT 투자 심의 기준 3개년")
    ]
    for p_i, (p_name, p_val, p_fmt, p_note) in enumerate(fin_params, start=6):
        ws_sim.cell(row=p_i, column=2, value=p_name).font = sub_header_font
        ws_sim.cell(row=p_i, column=2).border = cell_border; ws_sim.cell(row=p_i, column=2).fill = sub_header_fill

        c_v = ws_sim.cell(row=p_i, column=4, value=p_val)
        c_v.number_format = p_fmt; c_v.alignment = right_align; c_v.border = cell_border
        if str(p_val).startswith("="):
            if "!" in str(p_val): c_v.font = link_font
            else: c_v.font = bold_formula_font
        elif isinstance(p_val, (int, float)):
            c_v.font = input_font; c_v.fill = input_fill
        else:
            c_v.font = Font(name=font_name, size=10); c_v.alignment = center_align

        c_n = ws_sim.cell(row=p_i, column=5, value=p_note)
        c_n.font = Font(name=font_name, size=9, color="475569"); c_n.border = cell_border

    # KPI Summary Cards Block (Top Level Results)
    # Note: Monthly flows start at row 29 to 64!
    # Net cash flow is in column F (M1:F29 to M36:F64)
    # Outflows in D, Inflows in E
    ws_sim['B13'] = "■ 핵심 투자 타당성 및 ROI 지표 요약 (Key Investment Metrics)"
    ws_sim['B13'].font = section_font

    kpi_cards = [
        ("3개년 순현재가치 (3Y NPV, 천원)", "=NPV(D6/12, F29:F64) - D7", FMT_CURRENCY, "3개년 할인 순현금흐름 합계 - 초기비용"),
        ("3개년 ROI (%)", "=IF(G14>0, (G15-G14)/G14, \"계산 불가\")", FMT_PERCENT, "(3Y 할인 편익 - 3Y 할인 TCO) / 3Y 할인 TCO"),
        ("3개년 누적 순편익 (3Y Net Benefit, 천원)", "=H64", FMT_CURRENCY, "36개월 명목 순현금흐름(누적 순현금 M36) 합계"),
        ("투자 회수 기간 (Payback Period, 개월)", '=IF(D10<=0, "회수 불가", IF(H64<0, "회수 불가 (36M 초과)", ROUND(D7/D10, 1)))', "@", "B.1 가드: 월순편익<=0시 '회수 불가', 그 외 정밀 계산")
    ]
    for k_i, (k_name, k_val, k_fmt, k_note) in enumerate(kpi_cards, start=14):
        ws_sim.cell(row=k_i, column=2, value=k_name).font = Font(name=font_name, size=10, bold=True, color="1E3A8A")
        ws_sim.cell(row=k_i, column=2).border = cell_border; ws_sim.cell(row=k_i, column=2).fill = accent_fill

        c_kv = ws_sim.cell(row=k_i, column=4, value=k_val)
        c_kv.font = kpi_highlight_font; c_kv.number_format = k_fmt; c_kv.alignment = right_align; c_kv.border = cell_border; c_kv.fill = total_fill

        c_kn = ws_sim.cell(row=k_i, column=5, value=k_note)
        c_kn.font = Font(name=font_name, size=9, color="475569"); c_kn.border = cell_border

    # Extra supporting calculation cells for 3Y Discounted TCO (G14) and 3Y Discounted Benefit (G15)
    ws_sim['G13'] = "재무 검증용 중간 참조값"
    ws_sim['G14'] = "=D7 + NPV(D6/12, D29:D64)" # 3Y Discounted TCO (Outflows D29:D64)
    ws_sim['G14'].number_format = FMT_CURRENCY; ws_sim['G14'].font = Font(name=font_name, size=9, color="64748B")
    ws_sim['G15'] = "=NPV(D6/12, E29:E64)"      # 3Y Discounted Benefit (Inflows E29:E64)
    ws_sim['G15'].number_format = FMT_CURRENCY; ws_sim['G15'].font = Font(name=font_name, size=9, color="64748B")

    # 3 Scenarios Comparison Table
    ws_sim['B19'] = "■ 3대 시나리오 분석 (PRD 9.7절: 보수적 / 기준 / 공격적)"
    ws_sim['B19'].font = section_font

    scen_headers = ["시나리오 구분", "자동화/성공 가정", "비용 가정", "3개년 TCO (천원)", "3개년 편익 (천원)", "3개년 순편익 (천원)", "3년 ROI (%)", "회수기간 (개월)", "적용 권장 목적"]
    for c_i, h in enumerate(scen_headers, start=2):
        c = ws_sim.cell(row=20, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    # Conservative: +15% costs, -25% benefits
    ws_sim.cell(row=21, column=2, value="보수적 시나리오 (Conservative)").font = Font(name=font_name, size=9.5, bold=True, color="B45309")
    ws_sim.cell(row=21, column=3, value="자동화율 50%, 검토/실패율 2배").font = Font(name=font_name, size=9)
    ws_sim.cell(row=21, column=4, value="구축/운영비 +15% 증가").font = Font(name=font_name, size=9)
    ws_sim.cell(row=21, column=5, value="='04_TCO_8대비용군_산정'!G36*1.15").font = formula_font; ws_sim.cell(row=21, column=5).number_format = FMT_CURRENCY; ws_sim.cell(row=21, column=5).alignment = right_align
    ws_sim.cell(row=21, column=6, value="='05_편익_5대항목_산정'!E30*0.75").font = formula_font; ws_sim.cell(row=21, column=6).number_format = FMT_CURRENCY; ws_sim.cell(row=21, column=6).alignment = right_align
    ws_sim.cell(row=21, column=7, value="=F21-E21").font = bold_formula_font; ws_sim.cell(row=21, column=7).number_format = FMT_CURRENCY; ws_sim.cell(row=21, column=7).alignment = right_align
    ws_sim.cell(row=21, column=8, value="=(F21-E21)/E21").font = bold_formula_font; ws_sim.cell(row=21, column=8).number_format = FMT_PERCENT; ws_sim.cell(row=21, column=8).alignment = right_align
    ws_sim.cell(row=21, column=9, value="='04_TCO_8대비용군_산정'!D36*1.15 / ((F21-E21)/36)").font = bold_formula_font; ws_sim.cell(row=21, column=9).number_format = FMT_NUMBER; ws_sim.cell(row=21, column=9).alignment = right_align
    ws_sim.cell(row=21, column=10, value="기본 헤드라인 및 리스크 심의").font = Font(name=font_name, size=9, color="475569")

    # Baseline: Official numbers
    ws_sim.cell(row=22, column=2, value="기준 시나리오 (Baseline)").font = Font(name=font_name, size=9.5, bold=True, color="1E3A8A")
    ws_sim.cell(row=22, column=3, value="검증된 중앙값 자동화율 (69%)").font = Font(name=font_name, size=9)
    ws_sim.cell(row=22, column=4, value="승인 예산 표준 TCO").font = Font(name=font_name, size=9)
    ws_sim.cell(row=22, column=5, value="='04_TCO_8대비용군_산정'!G36").font = link_font; ws_sim.cell(row=22, column=5).number_format = FMT_CURRENCY; ws_sim.cell(row=22, column=5).alignment = right_align
    ws_sim.cell(row=22, column=6, value="='05_편익_5대항목_산정'!E30").font = link_font; ws_sim.cell(row=22, column=6).number_format = FMT_CURRENCY; ws_sim.cell(row=22, column=6).alignment = right_align
    ws_sim.cell(row=22, column=7, value="=F22-E22").font = kpi_highlight_font; ws_sim.cell(row=22, column=7).number_format = FMT_CURRENCY; ws_sim.cell(row=22, column=7).alignment = right_align
    ws_sim.cell(row=22, column=8, value="=(F22-E22)/E22").font = kpi_highlight_font; ws_sim.cell(row=22, column=8).number_format = FMT_PERCENT; ws_sim.cell(row=22, column=8).alignment = right_align
    ws_sim.cell(row=22, column=9, value="=D17").font = link_font; ws_sim.cell(row=22, column=9).number_format = FMT_NUMBER; ws_sim.cell(row=22, column=9).alignment = right_align
    ws_sim.cell(row=22, column=10, value="투자 심의 및 본품의 의사결정").font = Font(name=font_name, size=9, bold=True, color="1E3A8A")

    # Aggressive: +25% benefits, -10% costs
    ws_sim.cell(row=23, column=2, value="공격적 시나리오 (Aggressive)").font = Font(name=font_name, size=9.5, bold=True, color="15803D")
    ws_sim.cell(row=23, column=3, value="높은 사내 채택률 (85%), 전사확대").font = Font(name=font_name, size=9)
    ws_sim.cell(row=23, column=4, value="규모의 경제로 토큰/인프라 -10%").font = Font(name=font_name, size=9)
    ws_sim.cell(row=23, column=5, value="='04_TCO_8대비용군_산정'!G36*0.90").font = formula_font; ws_sim.cell(row=23, column=5).number_format = FMT_CURRENCY; ws_sim.cell(row=23, column=5).alignment = right_align
    ws_sim.cell(row=23, column=6, value="='05_편익_5대항목_산정'!E30*1.25").font = formula_font; ws_sim.cell(row=23, column=6).number_format = FMT_CURRENCY; ws_sim.cell(row=23, column=6).alignment = right_align
    ws_sim.cell(row=23, column=7, value="=F23-E23").font = bold_formula_font; ws_sim.cell(row=23, column=7).number_format = FMT_CURRENCY; ws_sim.cell(row=23, column=7).alignment = right_align
    ws_sim.cell(row=23, column=8, value="=(F23-E23)/E23").font = bold_formula_font; ws_sim.cell(row=23, column=8).number_format = FMT_PERCENT; ws_sim.cell(row=23, column=8).alignment = right_align
    ws_sim.cell(row=23, column=9, value="='04_TCO_8대비용군_산정'!D36*0.90 / ((F23-E23)/36)").font = bold_formula_font; ws_sim.cell(row=23, column=9).number_format = FMT_NUMBER; ws_sim.cell(row=23, column=9).alignment = right_align
    ws_sim.cell(row=23, column=10, value="최대 상한 포텐셜 및 비즈니스 케이스").font = Font(name=font_name, size=9, color="475569")

    for r_s in [21, 22, 23]:
        for c_i in range(2, 11):
            ws_sim.cell(row=r_s, column=c_i).border = cell_border
            if r_s == 22: ws_sim.cell(row=r_s, column=c_i).fill = total_fill

    # Monthly Cash Flow Schedule (Months 0 to 36)
    ws_sim['B26'] = "■ 36개월 월별 세부 현금흐름 스케줄 (Monthly Cash Flow Schedule)"
    ws_sim['B26'].font = section_font

    cf_headers = ["경과월\n(Month)", "월차 구분", "현금 유출 TCO\n(Outflow, 천원)", "현금 유입 편익\n(Inflow, 천원)", "순현금흐름\n(Net Cash Flow, 천원)", "할인 순현금흐름\n(Discounted Net, 천원)", "누적 순현금흐름\n(Cumulative Net, 천원)", "누적 할인 순현금흐름\n(Cumulative Disc, 천원)"]
    for c_i, h in enumerate(cf_headers, start=2):
        c = ws_sim.cell(row=27, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    # Month 0: Initial Investment
    r0 = 28
    ws_sim.cell(row=r0, column=2, value=0).alignment = center_align
    ws_sim.cell(row=r0, column=3, value="M0 (초기 구축/도입)").alignment = center_align
    ws_sim.cell(row=r0, column=4, value="=D7").font = link_font; ws_sim.cell(row=r0, column=4).number_format = FMT_CURRENCY; ws_sim.cell(row=r0, column=4).alignment = right_align
    ws_sim.cell(row=r0, column=5, value=0).number_format = FMT_CURRENCY; ws_sim.cell(row=r0, column=5).alignment = right_align
    ws_sim.cell(row=r0, column=6, value=f"=E{r0}-D{r0}").font = bold_formula_font; ws_sim.cell(row=r0, column=6).number_format = FMT_CURRENCY; ws_sim.cell(row=r0, column=6).alignment = right_align
    ws_sim.cell(row=r0, column=7, value=f"=F{r0}").font = formula_font; ws_sim.cell(row=r0, column=7).number_format = FMT_CURRENCY; ws_sim.cell(row=r0, column=7).alignment = right_align
    ws_sim.cell(row=r0, column=8, value=f"=F{r0}").font = formula_font; ws_sim.cell(row=r0, column=8).number_format = FMT_CURRENCY; ws_sim.cell(row=r0, column=8).alignment = right_align
    ws_sim.cell(row=r0, column=9, value=f"=G{r0}").font = kpi_highlight_font; ws_sim.cell(row=r0, column=9).number_format = FMT_CURRENCY; ws_sim.cell(row=r0, column=9).alignment = right_align
    for c_i in range(2, 10): ws_sim.cell(row=r0, column=c_i).border = cell_border; ws_sim.cell(row=r0, column=c_i).fill = zebra_fill

    # Months 1 to 36
    for m in range(1, 37):
        curr_r = 28 + m
        prev_r = curr_r - 1
        ws_sim.cell(row=curr_r, column=2, value=m).alignment = center_align
        ws_sim.cell(row=curr_r, column=3, value=f"M{m:02d}").alignment = center_align

        # Monthly Outflow = $D$8 (Run TCO)
        ws_sim.cell(row=curr_r, column=4, value="=$D$8").font = formula_font; ws_sim.cell(row=curr_r, column=4).number_format = FMT_CURRENCY; ws_sim.cell(row=curr_r, column=4).alignment = right_align

        # Monthly Inflow = $D$9 (Gross Benefit)
        ws_sim.cell(row=curr_r, column=5, value="=$D$9").font = formula_font; ws_sim.cell(row=curr_r, column=5).number_format = FMT_CURRENCY; ws_sim.cell(row=curr_r, column=5).alignment = right_align

        # Net Cash Flow = Inflow - Outflow
        ws_sim.cell(row=curr_r, column=6, value=f"=E{curr_r}-D{curr_r}").font = bold_formula_font; ws_sim.cell(row=curr_r, column=6).number_format = FMT_CURRENCY; ws_sim.cell(row=curr_r, column=6).alignment = right_align

        # Discounted Net = Net / (1 + Rate/12)^Month
        ws_sim.cell(row=curr_r, column=7, value=f"=F{curr_r}/(1+$D$6/12)^B{curr_r}").font = formula_font; ws_sim.cell(row=curr_r, column=7).number_format = FMT_CURRENCY; ws_sim.cell(row=curr_r, column=7).alignment = right_align

        # Cumulative Net = Prev Cum + Curr Net
        ws_sim.cell(row=curr_r, column=8, value=f"=H{prev_r}+F{curr_r}").font = formula_font; ws_sim.cell(row=curr_r, column=8).number_format = FMT_CURRENCY; ws_sim.cell(row=curr_r, column=8).alignment = right_align

        # Cumulative Discounted Net = Prev Cum Disc + Curr Disc Net
        c_cum_disc = ws_sim.cell(row=curr_r, column=9, value=f"=I{prev_r}+G{curr_r}")
        c_cum_disc.font = bold_formula_font; c_cum_disc.number_format = FMT_CURRENCY; c_cum_disc.alignment = right_align

        for c_i in range(2, 10):
            ws_sim.cell(row=curr_r, column=c_i).border = cell_border
            if m % 2 == 1: ws_sim.cell(row=curr_r, column=c_i).fill = zebra_fill

    sim_col_widths = {2: 12, 3: 16, 4: 20, 5: 20, 6: 22, 7: 22, 8: 24, 9: 26, 10: 28}
    for c_num, width in sim_col_widths.items():
        ws_sim.column_dimensions[get_column_letter(c_num)].width = width
    ws_sim.column_dimensions['A'].width = 3

    # ==========================================
    # 8. Sheet: 07_가치실현_KPI추적
    # ==========================================
    ws_val = wb.create_sheet(title="07_가치실현_KPI추적")
    ws_val.views.sheetView[0].showGridLines = True

    ws_val['B2'] = "■ AX 가치 실현 및 실제 성과 추적 (PRD 제14장 & Value Realization)"
    ws_val['B2'].font = title_font
    ws_val['B3'] = "운영 단계 과제의 기준선(Baseline) 대비 목표치(Target) 및 실제 실측치(Actual) 편차 관리 및 개선 Action Item"
    ws_val['B3'].font = subtitle_font

    val_headers = [
        "No", "핵심 성과 지표 (KPI)", "지표 유형", "기준선\n(AS-IS Baseline)", "목표치\n(Target)",
        "실제 측정치\n(Actual)", "단위", "목표 달성률\n(%)", "기준 대비 편차\n(%)", "상태 판정", "편차 원인 분석 및 개선 계획 (Action Items)"
    ]
    for c_i, h in enumerate(val_headers, start=2):
        c = ws_val.cell(row=5, column=c_i, value=h)
        c.font = header_font; c.fill = header_fill; c.alignment = center_align; c.border = header_border

    kpi_tracks = [
        (1, "주간 리포트 작성 총 소요시간", "시간/생산성", 30.0, 9.3, 8.5, "시간/월", "역방향", "실측 초과 달성: Agent 도입으로 티켓 분류 시간 대폭 단축"),
        (2, "엔지니어 1인당 절감 시간", "시간/생산성", 0.0, 20.7, 21.5, "시간/월", "정방향", "운영자 수용성 우수, 템플릿 표준화 안착"),
        (3, "보고서 데이터 오기입 및 재작업률", "품질/오류", 12.0, 3.0, 2.1, "%", "역방향", "지식 베이스 정합성 향상 및 자동 수치 대조 효과"),
        (4, "주간 보고서 경영진 배포 완료 시점", "SLA/속도", 18.0, 14.0, 12.5, "시 (금요일)", "역방향", "기존 금요일 18시 마감에서 12시 30분 조기 배포 달성"),
        (5, "월간 LLM 및 클라우드 인프라 실집행비", "비용/TCO", 0.0, 950, 880, "천원/월", "역방향", "프롬프트 캐싱 및 토큰 압축 기법 적용으로 7% 비용 절감"),
        (6, "월간 순 실현 편익 (Net Benefit)", "재무/편익", 0.0, 7150, 7420, "천원/월", "정방향", "절감 인력의 클라우드 장애 예방 고부가가치 전환 확인"),
        (7, "현업 사용자 만족도 점수 (CSAT)", "만족도", 2.8, 4.5, 4.6, "점 (5점 만점)", "정방향", "반복적인 로그 취합 스트레스 경감 만족도 매우 높음"),
        (8, "AI 보안 및 규제 정책 위반 건수", "보안/통제", 0.0, 0.0, 0.0, "건", "역방향", "보안 필터 및 개인정보 마스킹 100% 가동 (위반 0건 유지)")
    ]

    for k_idx, kpi in enumerate(kpi_tracks, start=6):
        ws_val.cell(row=k_idx, column=2, value=kpi[0]).alignment = center_align
        ws_val.cell(row=k_idx, column=3, value=kpi[1]).font = Font(name=font_name, size=9.5, bold=True)
        ws_val.cell(row=k_idx, column=4, value=kpi[2]).alignment = center_align
        
        # Baseline (E), Target (F), Actual (G)
        c_base = ws_val.cell(row=k_idx, column=5, value=kpi[3]); c_base.font = input_font; c_base.fill = input_fill; c_base.number_format = FMT_NUMBER; c_base.alignment = right_align
        c_tgt = ws_val.cell(row=k_idx, column=6, value=kpi[4]); c_tgt.font = input_font; c_tgt.fill = input_fill; c_tgt.number_format = FMT_NUMBER; c_tgt.alignment = right_align
        c_act = ws_val.cell(row=k_idx, column=7, value=kpi[5]); c_act.font = input_font; c_act.fill = input_fill; c_act.number_format = FMT_NUMBER; c_act.alignment = right_align

        ws_val.cell(row=k_idx, column=8, value=kpi[6]).alignment = center_align

        # Achievement Rate Formula:
        is_rev = (kpi[7] == "역방향")
        if is_rev:
            c_ach = ws_val.cell(row=k_idx, column=9, value=f"=IF(G{k_idx}>0, F{k_idx}/G{k_idx}, 1.0)")
        else:
            c_ach = ws_val.cell(row=k_idx, column=9, value=f"=IF(F{k_idx}>0, G{k_idx}/F{k_idx}, 1.0)")
        c_ach.font = bold_formula_font; c_ach.number_format = FMT_PERCENT; c_ach.alignment = right_align

        # Variance from Baseline:
        c_var = ws_val.cell(row=k_idx, column=10, value=f"=IF(E{k_idx}>0, (G{k_idx}-E{k_idx})/E{k_idx}, (G{k_idx}-F{k_idx})/F{k_idx})")
        c_var.font = formula_font; c_var.number_format = FMT_PERCENT; c_var.alignment = right_align

        # Status Badge
        c_st = ws_val.cell(row=k_idx, column=11, value=f'=IF(I{k_idx}>=1.0, "목표 달성", IF(I{k_idx}>=0.85, "주의 관찰", "미달 관리"))')
        c_st.font = Font(name=font_name, size=9.5, bold=True, color="15803D")
        c_st.alignment = center_align

        # Action note
        ws_val.cell(row=k_idx, column=12, value=kpi[8]).font = Font(name=font_name, size=9, color="334155")

        for c_i in range(2, 13):
            ws_val.cell(row=k_idx, column=c_i).border = cell_border
            if k_idx % 2 == 1: ws_val.cell(row=k_idx, column=c_i).fill = zebra_fill

    val_col_widths = {2: 6, 3: 32, 4: 15, 5: 16, 6: 16, 7: 16, 8: 14, 9: 16, 10: 16, 11: 14, 12: 48}
    for c_num, width in val_col_widths.items():
        ws_val.column_dimensions[get_column_letter(c_num)].width = width
    ws_val.column_dimensions['A'].width = 3

    # Remove initial default empty sheet if present
    if default_sheet.title in wb.sheetnames and len(wb.sheetnames) > 1:
        wb.remove(default_sheet)

    output_path = "excel/AX_Portfolio_Manager_ROI_Simulator.xlsx"
    wb.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    create_ax_roi_model()

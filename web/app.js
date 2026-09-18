/**
 * AX PORTFOLIO MANAGER + AI ROI SIMULATOR
 * Core Application Engine (PRD v3.0)
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Global Application State ---
  const state = {
    useCases: JSON.parse(JSON.stringify(window.AX_DATA.initialUseCases)),
    currentCaseId: "UC-2026-001",
    currentWorkflowSteps: JSON.parse(JSON.stringify(window.AX_DATA.templates[1].steps)),
    tcoItems: JSON.parse(JSON.stringify(window.AX_DATA.defaultTcoBreakdown)),
    directBenefits: JSON.parse(JSON.stringify(window.AX_DATA.defaultDirectBenefits)),
    drivers: { ...window.AX_DATA.defaultBenefitDrivers, autoDelta: 0 },
    scenario: "baseline",
    activeTab: "tab-home",
    currentRole: "owner",
    isMobileAppMode: false,
    auditLogs: JSON.parse(JSON.stringify(window.AX_DATA.auditLogs)),
    deferredPrompt: null
  };

  // --- DOM Elements Cache ---
  const el = {
    roleSelector: document.getElementById("roleSelector"),
    avatarIcon: document.getElementById("avatarIcon"),
    currentUserName: document.getElementById("currentUserName"),
    currentUserRoleBadge: document.getElementById("currentUserRoleBadge"),
    btnModeToggle: document.getElementById("btnModeToggle"),
    modeIcon: document.getElementById("modeIcon"),
    modeText: document.getElementById("modeText"),
    btnInstallPwa: document.getElementById("btnInstallPwa"),
    btnResetData: document.getElementById("btnResetData"),
    pageTitle: document.getElementById("pageTitle"),
    navItems: document.querySelectorAll(".nav-item"),
    mobileNavBtns: document.querySelectorAll(".mobile-nav-btn"),
    tabPanels: document.querySelectorAll(".tab-panel"),

    // Home
    cardBrowseOrg: document.getElementById("cardBrowseOrg"),
    inputHomeWorkDesc: document.getElementById("inputHomeWorkDesc"),
    btnHomeDecompose: document.getElementById("btnHomeDecompose"),
    btnQuickCreateUseCase: document.getElementById("btnQuickCreateUseCase"),
    btnGoFlagshipRoi: document.getElementById("btnGoFlagshipRoi"),
    kpiTotalCases: document.getElementById("kpiTotalCases"),
    kpiTotalNetBenefit: document.getElementById("kpiTotalNetBenefit"),
    kpiAvgRoi: document.getElementById("kpiAvgRoi"),
    kpiPendingGates: document.getElementById("kpiPendingGates"),

    // Catalog
    searchCatalog: document.getElementById("searchCatalog"),
    filterCategory: document.getElementById("filterCategory"),
    catalogCardsContainer: document.getElementById("catalogCardsContainer"),

    // Workflow Studio
    wfStudioTitle: document.getElementById("wfStudioTitle"),
    btnAddWfStep: document.getElementById("btnAddWfStep"),
    btnSaveWfIdea: document.getElementById("btnSaveWfIdea"),
    btnForwardRoi: document.getElementById("btnForwardRoi"),
    wfAsIsHours: document.getElementById("wfAsIsHours"),
    wfToBeHours: document.getElementById("wfToBeHours"),
    wfSavedHours: document.getElementById("wfSavedHours"),
    wfStepTableBody: document.getElementById("wfStepTableBody"),

    // Portfolio
    btnViewList: document.getElementById("btnViewList"),
    btnViewKanban: document.getElementById("btnViewKanban"),
    portfolioListView: document.getElementById("portfolioListView"),
    portfolioKanbanView: document.getElementById("portfolioKanbanView"),
    portfolioTableBody: document.getElementById("portfolioTableBody"),
    kanbanBoard: document.getElementById("kanbanBoard"),
    btnNewCaseModal: document.getElementById("btnNewCaseModal"),

    // ROI Simulator
    roiCaseTitle: document.getElementById("roiCaseTitle"),
    roiScenarioSelector: document.getElementById("roiScenarioSelector"),
    simNpv: document.getElementById("simNpv"),
    simRoi: document.getElementById("simRoi"),
    simNetBen: document.getElementById("simNetBen"),
    simPayback: document.getElementById("simPayback"),
    simPaybackSub: document.getElementById("simPaybackSub"),
    sliderHourlyRate: document.getElementById("sliderHourlyRate"),
    valHourlyRate: document.getElementById("valHourlyRate"),
    sliderRealizationRate: document.getElementById("sliderRealizationRate"),
    valRealizationRate: document.getElementById("valRealizationRate"),
    sliderDiscountRate: document.getElementById("sliderDiscountRate"),
    valDiscountRate: document.getElementById("valDiscountRate"),
    sliderAutoDelta: document.getElementById("sliderAutoDelta"),
    valAutoDelta: document.getElementById("valAutoDelta"),
    tcoGroupBars: document.getElementById("tcoGroupBars"),
    lblTotalTco3Y: document.getElementById("lblTotalTco3Y"),
    benGroupBars: document.getElementById("benGroupBars"),
    lblTotalBen3Y: document.getElementById("lblTotalBen3Y"),
    cashflowSvg: document.getElementById("cashflowSvg"),
    lblPaybackMarker: document.getElementById("lblPaybackMarker"),
    scenarioTableBody: document.getElementById("scenarioTableBody"),

    // Value Realization
    realizationTableBody: document.getElementById("realizationTableBody"),
    btnRecordActual: document.getElementById("btnRecordActual"),

    // Governance & Audit
    auditTableBody: document.getElementById("auditTableBody"),

    // Reports
    reportSummaryTable: document.getElementById("reportSummaryTable"),

    // Modal
    modalNewCase: document.getElementById("modalNewCase"),
    btnCloseNewCaseModal: document.getElementById("btnCloseNewCaseModal"),
    btnCancelNewCase: document.getElementById("btnCancelNewCase"),
    btnSubmitNewCase: document.getElementById("btnSubmitNewCase"),
    newCaseTitle: document.getElementById("newCaseTitle"),
    newCaseOrg: document.getElementById("newCaseOrg"),
    newCaseOwner: document.getElementById("newCaseOwner"),
    newCaseRisk: document.getElementById("newCaseRisk"),
    newCaseTemplate: document.getElementById("newCaseTemplate"),
    newCaseDesc: document.getElementById("newCaseDesc")
  };

  // --- Helper Formatting Utilities ---
  const fmt = {
    currencyKRW: (v) => {
      if (v === null || v === undefined || isNaN(v)) return "-";
      return Math.round(v).toLocaleString("ko-KR");
    },
    currencyM: (v) => {
      if (v === null || v === undefined || isNaN(v)) return "-";
      return "₩" + (v / 1000).toFixed(1) + "M";
    },
    percent: (v) => {
      if (v === null || v === undefined || isNaN(v)) return "-";
      return (v * 100).toFixed(1) + "%";
    },
    number1: (v) => {
      if (v === null || v === undefined || isNaN(v)) return "-";
      return Number(v).toFixed(1);
    }
  };

  // --- Tab Navigation Switcher ---
  function switchTab(tabId) {
    state.activeTab = tabId;

    el.tabPanels.forEach(p => {
      p.classList.toggle("active", p.id === tabId);
    });

    el.navItems.forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-tab") === tabId);
    });

    el.mobileNavBtns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });

    // Update Topbar Title
    const titles = {
      "tab-home": "Home / 빠른 시작",
      "tab-catalog": "조직·업무 카탈로그 (8대 기능 / 26대 템플릿)",
      "tab-workflow": "Workflow Discovery Studio",
      "tab-portfolio": "AX 과제 포트폴리오 관리대장",
      "tab-roi": "AI ROI & TCO 시뮬레이터",
      "tab-realization": "AX 가치 실현 및 KPI 성과 추적",
      "tab-governance": "책임 있는 AI 거버넌스 & 감사 로그",
      "tab-reports": "경영진 보고서 & 투자 심의 메모"
    };
    if (el.pageTitle) el.pageTitle.textContent = titles[tabId] || "AX Portfolio & ROI";

    // Re-render charts or tables if needed
    if (tabId === "tab-roi") renderRoiSimulator();
    if (tabId === "tab-portfolio") renderPortfolio();
    if (tabId === "tab-workflow") renderWorkflowStudio();
    if (tabId === "tab-realization") renderRealization();
    if (tabId === "tab-governance") renderAuditLogs();
    if (tabId === "tab-reports") renderExecutiveReport();
    if (tabId === "tab-home") renderHomeKpis();
  }

  // Bind Nav Events
  el.navItems.forEach(item => {
    item.addEventListener("click", () => switchTab(item.getAttribute("data-tab")));
  });
  el.mobileNavBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
  });

  // --- Role Switcher Handling ---
  const roles = {
    owner: { name: "김인프라 팀장", label: "Business Owner (IT)", avatar: "IT" },
    pmo: { name: "한재종 전무", label: "AX/AI PMO (전사)", avatar: "PM" },
    finance: { name: "박재무 수석", label: "Finance Reviewer", avatar: "FN" },
    risk: { name: "이보안 실장", label: "Risk/Security Officer", avatar: "RS" },
    exec: { name: "최CEO 대표이사", label: "Executive Viewer", avatar: "EX" }
  };

  el.roleSelector.addEventListener("change", (e) => {
    state.currentRole = e.target.value;
    const r = roles[state.currentRole] || roles.owner;
    el.currentUserName.textContent = r.name;
    el.currentUserRoleBadge.textContent = r.label;
    el.avatarIcon.textContent = r.avatar;
    addAuditLog("ROLE_SWITCHED", "SYSTEM", `사용자 역할을 '${r.label}'으로 전환`);
  });

  // --- Mobile App Viewport Simulator Toggle ---
  el.btnModeToggle.addEventListener("click", () => {
    state.isMobileAppMode = !state.isMobileAppMode;
    document.body.classList.toggle("mobile-app-mode", state.isMobileAppMode);
    if (state.isMobileAppMode) {
      el.modeIcon.textContent = "💻";
      el.modeText.textContent = "웹 포털 모드";
    } else {
      el.modeIcon.textContent = "📱";
      el.modeText.textContent = "앱 모드 전환";
    }
  });

  // --- PWA Installation Flow ---
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    if (el.btnInstallPwa) el.btnInstallPwa.style.display = "inline-flex";
  });

  if (el.btnInstallPwa) {
    el.btnInstallPwa.addEventListener("click", async () => {
      if (state.deferredPrompt) {
        state.deferredPrompt.prompt();
        const { outcome } = await state.deferredPrompt.userChoice;
        console.log("PWA install outcome:", outcome);
        state.deferredPrompt = null;
        el.btnInstallPwa.style.display = "none";
      }
    });
  }

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.warn("ServiceWorker registration note:", err);
    });
  }

  // --- Reset to Demo Data ---
  el.btnResetData.addEventListener("click", () => {
    if (confirm("기본 시뮬레이션 및 포트폴리오 데이터를 초기화하시겠습니까?")) {
      state.useCases = JSON.parse(JSON.stringify(window.AX_DATA.initialUseCases));
      state.currentWorkflowSteps = JSON.parse(JSON.stringify(window.AX_DATA.templates[1].steps));
      state.drivers = { ...window.AX_DATA.defaultBenefitDrivers, autoDelta: 0 };
      renderAll();
      addAuditLog("DATA_RESET", "SYSTEM", "기본 샘플 데이터셋 및 시뮬레이션 복원");
      alert("데이터가 초기화되었습니다.");
    }
  });

  // --- Module 1: Home Screen ---
  function renderHomeKpis() {
    const totalCases = state.useCases.length;
    const totalNet = state.useCases.reduce((acc, c) => acc + (c.annualNet * 3), 0);
    const avgRoi = state.useCases.reduce((acc, c) => acc + c.threeYearRoi, 0) / totalCases;
    const pendingGates = state.useCases.filter(c => c.gate.includes("대기")).length;

    el.kpiTotalCases.textContent = `${totalCases} 건`;
    el.kpiTotalNetBenefit.textContent = fmt.currencyM(totalNet);
    el.kpiAvgRoi.textContent = fmt.percent(avgRoi);
    el.kpiPendingGates.textContent = `${pendingGates} 건`;
  }

  el.cardBrowseOrg.addEventListener("click", () => {
    switchTab("tab-catalog");
  });

  el.btnHomeDecompose.addEventListener("click", () => {
    const desc = el.inputHomeWorkDesc.value.trim();
    if (!desc) {
      alert("업무 설명을 입력해주세요.");
      return;
    }
    aiDecomposeWorkflow(desc);
    switchTab("tab-workflow");
  });

  el.btnGoFlagshipRoi.addEventListener("click", () => {
    state.currentCaseId = "UC-2026-001";
    switchTab("tab-roi");
  });

  // --- Module 2: Organization & Work Library (Catalog) ---
  function renderCatalog() {
    const query = (el.searchCatalog.value || "").toLowerCase();
    const catFilter = el.filterCategory.value;

    const filtered = window.AX_DATA.templates.filter(t => {
      const matchCat = (catFilter === "all" || t.catId === catFilter);
      const matchQuery = !query || t.title.toLowerCase().includes(query) || 
                         t.desc.toLowerCase().includes(query) || 
                         t.pattern.toLowerCase().includes(query) ||
                         t.workflow.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    el.catalogCardsContainer.innerHTML = filtered.map(t => `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <span class="badge badge-blue" style="margin-bottom: 4px;">${t.catName}</span>
              <h4 style="font-size: 1rem; font-weight: 700; color: #fff;">${t.title}</h4>
            </div>
            <span class="badge ${t.riskTier.includes("Tier 1") ? "badge-red" : (t.riskTier.includes("Tier 2") ? "badge-amber" : "badge-green")}">
              ${t.riskTier}
            </span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">${t.desc}</p>
          
          <div style="background: rgba(0,0,0,0.25); border-radius: 6px; padding: 0.6rem; font-size: 0.75rem; margin-bottom: 0.75rem; line-height: 1.4;">
            <div style="color: #93c5fd; font-weight: 600; margin-bottom: 2px;">기본 워크플로우:</div>
            <div style="color: #cbd5e1;">${t.workflow}</div>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.72rem; color: var(--text-dim); margin-bottom: 1rem;">
            <span>🤖 AI 패턴: <strong style="color:#e2e8f0;">${t.pattern}</strong></span>
            <span>⚡ 예상 자동화율: <strong style="color:#38bdf8;">${(t.autoRate * 100).toFixed(0)}%</strong></span>
            <span>⏱️ 건당 기준: <strong style="color:#e2e8f0;">${t.baseMin}분</strong></span>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.72rem; color: var(--text-dim);">월 평균 ${t.avgVolume}건</span>
          <button class="btn btn-primary btn-sm btn-use-template" data-tmpl-id="${t.id}">
            이 템플릿으로 시작 →
          </button>
        </div>
      </div>
    `).join("");

    // Bind Template Selection
    document.querySelectorAll(".btn-use-template").forEach(btn => {
      btn.addEventListener("click", () => {
        const tmplId = btn.getAttribute("data-tmpl-id");
        applyTemplateToStudio(tmplId);
      });
    });
  }

  el.searchCatalog.addEventListener("input", renderCatalog);
  el.filterCategory.addEventListener("change", renderCatalog);

  function applyTemplateToStudio(tmplId) {
    const tmpl = window.AX_DATA.templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    state.currentWorkflowSteps = JSON.parse(JSON.stringify(tmpl.steps));
    el.wfStudioTitle.textContent = `[신규 과제] ${tmpl.title} (기반 템플릿: ${tmpl.id})`;
    addAuditLog("TEMPLATE_SELECTED", tmpl.id, `표준 템플릿 '${tmpl.title}'을 Workflow Studio에 적용`);
    switchTab("tab-workflow");
  }

  // --- Module 3: Workflow Discovery Studio ---
  function aiDecomposeWorkflow(desc) {
    // Deterministic AI decomposition rule based on keywords
    const isReport = desc.includes("보고") || desc.includes("취합") || desc.includes("로그");
    const isCustomer = desc.includes("고객") || desc.includes("상담") || desc.includes("문의");
    const isDoc = desc.includes("계약") || desc.includes("문서") || desc.includes("규제");

    let steps = [];
    if (isReport) {
      steps = [
        { no: 1, name: "원천 시스템 데이터 및 로그 자동 수집", role: "AI Agent", system: "ITSM, Zabbix", pattern: "분류·추출", min: 80, auto: 0.85, hitl: false },
        { no: 2, name: "데이터 정제 및 이상 변동치 탐지", role: "AI 엔진", system: "분석 플랫폼", pattern: "분석·탐지", min: 70, auto: 0.80, hitl: false },
        { no: 3, name: "원인 및 영향도 분석 요약", role: "시스템 아키텍트", system: "Wiki/Jira", pattern: "검색/RAG", min: 90, auto: 0.70, hitl: false },
        { no: 4, name: "경영진 보고서 초안 자동 생성", role: "LLM", system: "M365", pattern: "요약·작성", min: 80, auto: 0.80, hitl: false },
        { no: 5, name: "담당 팀장 검토 및 사실 확인 (HITL)", role: "IT 운영팀장", system: "사내 포털", pattern: "Human Review", min: 60, auto: 0.20, hitl: true },
        { no: 6, name: "최종 보고서 배포 및 이력 보존", role: "기획자", system: "Outlook", pattern: "Agent/Workflow", min: 40, auto: 0.75, hitl: false }
      ];
    } else if (isCustomer) {
      steps = [
        { no: 1, name: "다채널 고객 문의 접수 및 감성 분석", role: "AI 봇", system: "CTI/채팅", pattern: "분류·추출", min: 4, auto: 0.90, hitl: false },
        { no: 2, name: "매뉴얼 및 정책 지식베이스 RAG 검색", role: "AI 엔진", system: "지식 DB", pattern: "검색/RAG", min: 6, auto: 0.85, hitl: false },
        { no: 3, name: "상담원 맞춤 답변 가이드 추천", role: "Agent", system: "CRM", pattern: "요약·작성", min: 5, auto: 0.75, hitl: false },
        { no: 4, name: "전문 상담원 검토 후 고객 전송 (HITL)", role: "상담원", system: "CRM", pattern: "Human Review", min: 4, auto: 0.25, hitl: true }
      ];
    } else {
      steps = [
        { no: 1, name: "문서 접수 및 텍스트/표 파싱", role: "AI OCR", system: "문서 포털", pattern: "분류·추출", min: 50, auto: 0.90, hitl: false },
        { no: 2, name: "사내 표준 규정 대조 및 위험 조항 분석", role: "AI 엔진", system: "지식베이스", pattern: "검색/RAG", min: 90, auto: 0.75, hitl: false },
        { no: 3, name: "수정 의견 및 리스크 검토서 초안 작성", role: "LLM", system: "Word", pattern: "요약·작성", min: 80, auto: 0.65, hitl: false },
        { no: 4, name: "전문가 및 부서장 최종 법률 검토 (HITL)", role: "전문가", system: "전자결재", pattern: "Human Review", min: 60, auto: 0.10, hitl: true }
      ];
    }

    state.currentWorkflowSteps = steps;
    el.wfStudioTitle.textContent = `[자유 입력 기반 생성] ${desc.slice(0, 30)}...`;
    addAuditLog("WORKFLOW_AI_DECOMPOSED", "SYSTEM", `자유 텍스트 기반 ${steps.length}단계 워크플로우 자동 생성`);
    renderWorkflowStudio();
  }

  function renderWorkflowStudio() {
    let totalAsIsMin = 0;
    let totalToBeMin = 0;
    let hitlCount = 0;
    const volume = 4; // 월 4회
    const people = 3; // 3명

    const rowsHtml = state.currentWorkflowSteps.map((s, idx) => {
      const autoRate = Math.min(1.0, Math.max(0, s.auto + (state.drivers.autoDelta / 100)));
      const residual = s.min * (1 - autoRate);
      const reviewRate = s.hitl ? 0.8 : 0.2;
      const reviewTime = s.min * autoRate * reviewRate;
      const failRate = 0.05;
      const failTime = s.min * failRate * 0.5;
      const reworkRate = 0.05;
      const reworkTime = reworkRate * 15;
      const toBeMin = residual + reviewTime + failTime + reworkTime;
      const savedMin = Math.max(0, s.min - toBeMin);
      const monthlySavedHrs = (savedMin * volume * people) / 60;

      totalAsIsMin += s.min;
      totalToBeMin += toBeMin;
      if (s.hitl) hitlCount++;

      return `
        <tr>
          <td style="text-align: center; font-weight: 700; color: #94a3b8;">${s.no || idx + 1}</td>
          <td><input type="text" class="form-input wf-step-name" data-idx="${idx}" value="${s.name}" style="padding: 3px 6px; font-size: 0.8rem;"></td>
          <td><input type="text" class="form-input wf-step-role" data-idx="${idx}" value="${s.role}" style="padding: 3px 6px; font-size: 0.8rem; width: 110px;"></td>
          <td style="font-size: 0.75rem; color: #94a3b8;">${s.system}</td>
          <td>
            <select class="form-select wf-step-pattern" data-idx="${idx}" style="padding: 2px 4px; font-size: 0.75rem; width: 110px;">
              <option value="분류·추출" ${s.pattern.includes("추출") ? "selected" : ""}>분류·추출</option>
              <option value="검색/RAG" ${s.pattern.includes("RAG") ? "selected" : ""}>검색/RAG</option>
              <option value="요약·작성" ${s.pattern.includes("요약") ? "selected" : ""}>요약·작성</option>
              <option value="분석·탐지" ${s.pattern.includes("탐지") ? "selected" : ""}>분석·탐지</option>
              <option value="Agent/Workflow" ${s.pattern.includes("Agent") ? "selected" : ""}>Agent/Workflow</option>
              <option value="Human Review" ${s.pattern.includes("Human") ? "selected" : ""}>Human Review</option>
            </select>
          </td>
          <td style="text-align: right;"><input type="number" class="form-input wf-step-min" data-idx="${idx}" value="${s.min}" style="padding: 3px 6px; font-size: 0.8rem; width: 65px; text-align: right;"></td>
          <td style="text-align: right; color: #38bdf8; font-weight: 600;">${(autoRate * 100).toFixed(0)}%</td>
          <td style="text-align: right; color: var(--text-dim);">${(reviewRate * 100).toFixed(0)}%</td>
          <td style="text-align: right; color: var(--text-dim);">${(failRate * 100).toFixed(0)}%</td>
          <td style="text-align: right; color: var(--text-dim);">${reworkTime.toFixed(1)}분</td>
          <td style="text-align: right; font-weight: 700; color: #e2e8f0;">${toBeMin.toFixed(1)}</td>
          <td style="text-align: right; font-weight: 700; color: #34d399;">${monthlySavedHrs.toFixed(1)}h</td>
          <td style="text-align: center;">
            <input type="checkbox" class="wf-step-hitl" data-idx="${idx}" ${s.hitl ? "checked" : ""} title="Human-in-the-loop 필수 검토 단계">
          </td>
          <td style="text-align: center;">
            <button class="btn btn-outline btn-sm btn-del-step" data-idx="${idx}" style="color: #ef4444; padding: 2px 6px;">✕</button>
          </td>
        </tr>
      `;
    }).join("");

    el.wfStepTableBody.innerHTML = rowsHtml;

    // Totals
    const asIsHours = (totalAsIsMin * volume * people) / 60;
    const toBeHours = (totalToBeMin * volume * people) / 60;
    const savedHours = Math.max(0, asIsHours - toBeHours);

    el.wfAsIsHours.textContent = `${asIsHours.toFixed(1)} 시간/월`;
    el.wfToBeHours.textContent = `${toBeHours.toFixed(1)} 시간/월`;
    el.wfSavedHours.textContent = `${savedHours.toFixed(1)} 시간/월`;

    // Bind inline edits
    document.querySelectorAll(".wf-step-min").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = Number(e.target.getAttribute("data-idx"));
        state.currentWorkflowSteps[idx].min = Number(e.target.value) || 10;
        renderWorkflowStudio();
      });
    });

    document.querySelectorAll(".wf-step-hitl").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const idx = Number(e.target.getAttribute("data-idx"));
        state.currentWorkflowSteps[idx].hitl = e.target.checked;
        renderWorkflowStudio();
      });
    });

    document.querySelectorAll(".btn-del-step").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        if (state.currentWorkflowSteps.length <= 2) {
          alert("워크플로우는 최소 2개 이상의 단계가 필요합니다.");
          return;
        }
        state.currentWorkflowSteps.splice(idx, 1);
        renderWorkflowStudio();
      });
    });
  }

  el.btnAddWfStep.addEventListener("click", () => {
    state.currentWorkflowSteps.push({
      no: state.currentWorkflowSteps.length + 1,
      name: "새로운 업무 처리 단계",
      role: "실무 담당자",
      system: "업무 시스템",
      pattern: "요약·작성",
      min: 45,
      auto: 0.60,
      hitl: false
    });
    renderWorkflowStudio();
  });

  el.btnSaveWfIdea.addEventListener("click", () => {
    const title = el.wfStudioTitle.textContent.replace("[신규 과제] ", "").replace("[자유 입력 기반 생성] ", "");
    const newId = `UC-2026-${String(state.useCases.length + 1).padStart(3, "0")}`;
    const newCase = {
      id: newId,
      title: title || "신규 발굴 AI 과제",
      org: "정보기술·데이터",
      owner: el.currentUserName.textContent,
      stage: "Idea",
      gate: "G0 등록",
      riskTier: "Tier 2 (보통)",
      scores: { value: 4.2, feasibility: 4.0, alignment: 4.0, reuse: 3.5, risk: 2.0 },
      priorityScore: 7.8,
      annualBenefit: 82000,
      annualTco: 26000,
      annualNet: 56000,
      threeYearTco: 48000,
      threeYearRoi: 2.55,
      paybackMonths: 5.6,
      status: "Idea",
      desc: "Workflow Studio에서 구조화하여 Idea 상태로 등록된 과제"
    };

    state.useCases.push(newCase);
    state.currentCaseId = newId;
    addAuditLog("USE_CASE_REGISTERED", newId, `포트폴리오에 신규 과제 '${newCase.title}' 등록 (G0 Gate)`);
    alert(`과제가 포트폴리오에 성공적으로 등록되었습니다: [${newId}] ${newCase.title}`);
    switchTab("tab-portfolio");
  });

  el.btnForwardRoi.addEventListener("click", () => {
    addAuditLog("WORKFLOW_FORWARDED_TO_ROI", state.currentCaseId, "확정 워크플로우를 AI ROI Simulator로 자동 전달");
    switchTab("tab-roi");
  });

  // --- Module 4: Portfolio Manager ---
  function renderPortfolio() {
    renderPortfolioTable();
    renderPortfolioKanban();
  }

  function renderPortfolioTable() {
    el.portfolioTableBody.innerHTML = state.useCases.map(c => `
      <tr class="${c.id === state.currentCaseId ? "selected" : ""}">
        <td style="font-family: monospace; font-weight: 700; color: #38bdf8;">${c.id}</td>
        <td><strong style="color: #fff; cursor: pointer;" class="case-title-link" data-id="${c.id}">${c.title}</strong></td>
        <td>${c.org}</td>
        <td>${c.owner}</td>
        <td><span class="badge badge-blue">${c.stage}</span></td>
        <td><span class="badge ${c.gate.includes("통과") || c.gate.includes("운영") ? "badge-green" : "badge-amber"}">${c.gate}</span></td>
        <td><span class="badge ${c.riskTier.includes("Tier 1") ? "badge-red" : (c.riskTier.includes("Tier 2") ? "badge-amber" : "badge-green")}">${c.riskTier}</span></td>
        <td style="text-align: right; font-weight: 700; color: #38bdf8;">${c.priorityScore.toFixed(1)}</td>
        <td style="text-align: right; font-weight: 600; color: #34d399;">${fmt.currencyKRW(c.annualNet)}</td>
        <td style="text-align: right;">${fmt.currencyKRW(c.threeYearTco)}</td>
        <td style="text-align: right; font-weight: 700; color: #60a5fa;">${fmt.percent(c.threeYearRoi)}</td>
        <td style="text-align: right;">${c.paybackMonths ? c.paybackMonths.toFixed(1) + "개월" : "회수 불가"}</td>
        <td><span class="badge ${c.status === "Approved" || c.status === "In-Ops" ? "badge-green" : "badge-amber"}">${c.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm btn-case-sim" data-id="${c.id}" style="padding: 2px 6px;">ROI 분석</button>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll(".case-title-link").forEach(link => {
      link.addEventListener("click", () => {
        state.currentCaseId = link.getAttribute("data-id");
        switchTab("tab-roi");
      });
    });

    document.querySelectorAll(".btn-case-sim").forEach(btn => {
      btn.addEventListener("click", () => {
        state.currentCaseId = btn.getAttribute("data-id");
        switchTab("tab-roi");
      });
    });
  }

  function renderPortfolioKanban() {
    const stages = [
      { id: "Idea", name: "Idea / 등록", gate: "G0~G1" },
      { id: "Screening", name: "Screening / 선별", gate: "G1 통과" },
      { id: "Assessment", name: "Assessment / 사업성", gate: "G2 심의" },
      { id: "PoC", name: "PoC / 기술검증", gate: "G3~G4" },
      { id: "Pilot", name: "Pilot / 시범적용", gate: "G4 통과" },
      { id: "Production", name: "Production / 운영", gate: "G5 운영" },
      { id: "Optimize", name: "Optimize / 가치실현", gate: "G6 검증" }
    ];

    el.kanbanBoard.innerHTML = stages.map(st => {
      const casesInStage = state.useCases.filter(c => c.stage === st.id);
      return `
        <div class="kanban-column">
          <div class="kanban-col-header">
            <div>
              <span>${st.name}</span>
              <div style="font-size: 0.68rem; color: var(--text-dim); font-weight: 400;">${st.gate}</div>
            </div>
            <span class="badge badge-blue">${casesInStage.length}</span>
          </div>
          <div class="kanban-cards">
            ${casesInStage.map(c => `
              <div class="kanban-card" data-id="${c.id}">
                <div class="kanban-card-id">${c.id}</div>
                <div class="kanban-card-title">${c.title}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px;">${c.org} | ${c.owner}</div>
                <div style="display: flex; gap: 4px; margin-bottom: 6px;">
                  <span class="badge ${c.riskTier.includes("Tier 1") ? "badge-red" : "badge-blue"}" style="font-size: 0.65rem;">${c.riskTier.split(" ")[0]}</span>
                  <span class="badge badge-green" style="font-size: 0.65rem;">ROI ${fmt.percent(c.threeYearRoi)}</span>
                </div>
                <div class="kanban-card-meta">
                  <span>순편익 ${fmt.currencyKRW(c.annualNet)}천원</span>
                  <button class="btn btn-outline btn-sm btn-advance-gate" data-id="${c.id}" style="padding: 2px 4px; font-size: 0.68rem;">
                    게이트 승인 ➔
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");

    // Bind Kanban card click
    document.querySelectorAll(".kanban-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-advance-gate")) return;
        state.currentCaseId = card.getAttribute("data-id");
        switchTab("tab-roi");
      });
    });

    // Bind Gate advance button
    document.querySelectorAll(".btn-advance-gate").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute("data-id");
        advanceCaseGate(cid);
      });
    });
  }

  function advanceCaseGate(cid) {
    const c = state.useCases.find(x => x.id === cid);
    if (!c) return;

    // AC-010 Rule: High-Risk (Tier 1) cannot enter Production without Risk/Security approval
    if (c.stage === "Pilot" && c.riskTier.includes("Tier 1")) {
      if (state.currentRole !== "risk" && state.currentRole !== "pmo") {
        alert("⚠️ [AC-010 정책 위반 방지]: Tier 1 고위험 과제는 Risk/Security Officer의 사전 검증 승인 없이는 Production으로 전환할 수 없습니다.");
        return;
      }
    }

    const stageMap = {
      Idea: { next: "Screening", gate: "G1 통과" },
      Screening: { next: "Assessment", gate: "G2 심의" },
      Assessment: { next: "PoC", gate: "G3 통과" },
      PoC: { next: "Pilot", gate: "G4 통과" },
      Pilot: { next: "Production", gate: "G5 운영" },
      Production: { next: "Optimize", gate: "G6 검증" },
      Optimize: { next: "Optimize", gate: "G6 완료" }
    };

    const nxt = stageMap[c.stage];
    if (nxt && c.stage !== "Optimize") {
      const oldStage = c.stage;
      c.stage = nxt.next;
      c.gate = nxt.gate;
      addAuditLog("STAGE_TRANSITION", c.id, `과제 단계를 '${oldStage}'에서 '${c.stage}' (${c.gate})로 승인 전이`);
      renderPortfolio();
      alert(`[${c.id}] ${c.title} 과제가 '${c.stage}' (${c.gate}) 단계로 승인되었습니다.`);
    }
  }

  el.btnViewList.addEventListener("click", () => {
    el.portfolioListView.style.display = "block";
    el.portfolioKanbanView.style.display = "none";
    el.btnViewList.style.background = "#2563eb";
    el.btnViewList.style.color = "#fff";
    el.btnViewKanban.style.background = "#1e293b";
  });

  el.btnViewKanban.addEventListener("click", () => {
    el.portfolioListView.style.display = "none";
    el.portfolioKanbanView.style.display = "block";
    el.btnViewKanban.style.background = "#2563eb";
    el.btnViewKanban.style.color = "#fff";
    el.btnViewList.style.background = "#1e293b";
  });

  // New Case Modal Handling
  el.btnNewCaseModal.addEventListener("click", () => {
    populateModalTemplates();
    el.modalNewCase.classList.add("active");
  });
  el.btnQuickCreateUseCase.addEventListener("click", () => {
    populateModalTemplates();
    el.modalNewCase.classList.add("active");
  });
  el.btnCloseNewCaseModal.addEventListener("click", () => el.modalNewCase.classList.remove("active"));
  el.btnCancelNewCase.addEventListener("click", () => el.modalNewCase.classList.remove("active"));

  function populateModalTemplates() {
    el.newCaseTemplate.innerHTML = `<option value="">직접 작성 (자유 워크플로우)</option>` + 
      window.AX_DATA.templates.map(t => `<option value="${t.id}">[${t.catName}] ${t.title}</option>`).join("");
  }

  el.btnSubmitNewCase.addEventListener("click", () => {
    const title = el.newCaseTitle.value.trim();
    const owner = el.newCaseOwner.value.trim();
    if (!title || !owner) {
      alert("과제명과 소유자를 입력해주세요.");
      return;
    }

    const newId = `UC-2026-${String(state.useCases.length + 1).padStart(3, "0")}`;
    const tmplId = el.newCaseTemplate.value;
    const tmpl = window.AX_DATA.templates.find(t => t.id === tmplId);

    const newCase = {
      id: newId,
      title: title,
      org: el.newCaseOrg.value,
      owner: owner,
      stage: "Idea",
      gate: "G0 등록",
      riskTier: el.newCaseRisk.value,
      scores: { value: 4.0, feasibility: 4.0, alignment: 4.0, reuse: 3.5, risk: 2.0 },
      priorityScore: 7.7,
      annualBenefit: 85000,
      annualTco: 28000,
      annualNet: 57000,
      threeYearTco: 52000,
      threeYearRoi: 2.65,
      paybackMonths: 5.8,
      status: "Idea",
      templateId: tmplId || null,
      desc: el.newCaseDesc.value.trim()
    };

    state.useCases.push(newCase);
    state.currentCaseId = newId;

    if (tmpl) {
      state.currentWorkflowSteps = JSON.parse(JSON.stringify(tmpl.steps));
    }

    addAuditLog("USE_CASE_REGISTERED", newId, `신규 과제 등록: ${title}`);
    el.modalNewCase.classList.remove("active");
    el.newCaseTitle.value = "";
    el.newCaseDesc.value = "";

    renderPortfolio();
    switchTab("tab-portfolio");
  });

  // --- Module 5: AI ROI Simulator Engine ---
  function calculateRoiModel() {
    // 1. Calculate Workflow Labor Savings
    let totalAsIsMin = 0;
    let totalToBeMin = 0;
    const volume = 4;
    const people = 3;

    state.currentWorkflowSteps.forEach(s => {
      const autoRate = Math.min(1.0, Math.max(0, s.auto + (state.drivers.autoDelta / 100)));
      const residual = s.min * (1 - autoRate);
      const reviewRate = s.hitl ? 0.8 : 0.2;
      const reviewTime = s.min * autoRate * reviewRate;
      const failRate = 0.05;
      const failTime = s.min * failRate * 0.5;
      const reworkRate = 0.05;
      const reworkTime = reworkRate * 15;
      const toBeMin = residual + reviewTime + failTime + reworkTime;

      totalAsIsMin += s.min;
      totalToBeMin += toBeMin;
    });

    const asIsHours = (totalAsIsMin * volume * people) / 60;
    const toBeHours = (totalToBeMin * volume * people) / 60;
    const savedHoursPerMonth = Math.max(0, asIsHours - toBeHours);

    // 2. Scenario Multipliers (PRD 9.7)
    let costMult = 1.0;
    let benefitMult = 1.0;
    if (state.scenario === "conservative") {
      costMult = 1.15;
      benefitMult = 0.75;
    } else if (state.scenario === "aggressive") {
      costMult = 0.90;
      benefitMult = 1.25;
    }

    // 3. 5 Benefits Dimensions Calculation (Monthly)
    // Dimension 1: Labor Capacity Value = Saved Hours * Hourly Rate (천원) * Realization Rate
    const hourlyCostKRW = state.drivers.hourlyLaborRate / 1000; // in 천원
    const laborCapacityMonthly = savedHoursPerMonth * hourlyCostKRW * state.drivers.capacityRealizationRate;

    // Dimension 2 to 5: Direct, Quality, Risk-Adjusted, Revenue
    const otherDirectMonthly = state.directBenefits.reduce((sum, b) => sum + b.monthly, 0);

    const grossBenefitMonthly = (laborCapacityMonthly + otherDirectMonthly) * benefitMult;
    const annualGrossBenefit = grossBenefitMonthly * 12;
    const threeYearGrossBenefit = grossBenefitMonthly * 36;

    // 4. 8 TCO Cost Categories Calculation
    const initialTcoOneTime = state.tcoItems.reduce((sum, item) => sum + item.initial, 0) * costMult;
    const monthlyRunTco = state.tcoItems.reduce((sum, item) => sum + item.monthly, 0) * costMult;
    const annualTco = initialTcoOneTime + (monthlyRunTco * 12);
    const threeYearTco = initialTcoOneTime + (monthlyRunTco * 36);

    // 5. Monthly Cash Flows & Net Present Value (Months 0 to 36)
    const monthlyDiscountRate = state.drivers.discountRate / 12;
    let cumulativeDiscountedNet = -initialTcoOneTime;
    let paybackMonth = null;
    const cashFlowSchedule = [];

    // M0
    cashFlowSchedule.push({
      m: 0,
      outflow: initialTcoOneTime,
      inflow: 0,
      net: -initialTcoOneTime,
      discNet: -initialTcoOneTime,
      cumDisc: -initialTcoOneTime
    });

    const netMonthlyBenefit = grossBenefitMonthly - monthlyRunTco;

    for (let m = 1; m <= 36; m++) {
      const outflow = monthlyRunTco;
      const inflow = grossBenefitMonthly;
      const net = inflow - outflow;
      const discountFactor = 1 / Math.pow(1 + monthlyDiscountRate, m);
      const discNet = net * discountFactor;
      cumulativeDiscountedNet += discNet;

      if (paybackMonth === null && cumulativeDiscountedNet >= 0) {
        paybackMonth = m;
      }

      cashFlowSchedule.push({
        m: m,
        outflow: outflow,
        inflow: inflow,
        net: net,
        discNet: discNet,
        cumDisc: cumulativeDiscountedNet
      });
    }

    // 6. Final Financial Metrics with PRD Exception Guard
    const npv3Y = cumulativeDiscountedNet; // Sum of discounted cash flows
    
    // Discounted TCO & Benefit for ROI formula
    const discountedTco3Y = initialTcoOneTime + Array.from({length: 36}, (_, i) => monthlyRunTco / Math.pow(1 + monthlyDiscountRate, i + 1)).reduce((a, b) => a + b, 0);
    const discountedBenefit3Y = Array.from({length: 36}, (_, i) => grossBenefitMonthly / Math.pow(1 + monthlyDiscountRate, i + 1)).reduce((a, b) => a + b, 0);

    let roi3Y = 0;
    if (discountedTco3Y > 0) {
      roi3Y = (discountedBenefit3Y - discountedTco3Y) / discountedTco3Y;
    }

    // Payback Guard Rule (B.1): If netMonthlyBenefit <= 0 -> "회수 불가"
    let paybackResult = "";
    if (netMonthlyBenefit <= 0) {
      paybackResult = "회수 불가";
    } else if (paybackMonth !== null) {
      paybackResult = `${paybackMonth.toFixed(1)} 개월`;
    } else {
      paybackResult = "회수 불가 (36M 초과)";
    }

    return {
      savedHoursPerMonth,
      grossBenefitMonthly,
      annualGrossBenefit,
      threeYearGrossBenefit,
      initialTcoOneTime,
      monthlyRunTco,
      annualTco,
      threeYearTco,
      netMonthlyBenefit,
      npv3Y,
      roi3Y,
      paybackResult,
      paybackMonth,
      cashFlowSchedule,
      laborCapacityMonthly
    };
  }

  function renderRoiSimulator() {
    const res = calculateRoiModel();

    // Update Flagship Case in State
    const curr = state.useCases.find(x => x.id === state.currentCaseId);
    if (curr) {
      el.roiCaseTitle.textContent = `[${curr.id}] ${curr.title} ROI 시뮬레이션 (${state.scenario.toUpperCase()})`;
      curr.annualBenefit = res.annualGrossBenefit;
      curr.annualTco = res.annualTco;
      curr.annualNet = res.annualGrossBenefit - res.annualTco;
      curr.threeYearTco = res.threeYearTco;
      curr.threeYearRoi = res.roi3Y;
      curr.paybackMonths = res.paybackMonth || null;
    }

    // Top Metric Cards
    el.simNpv.textContent = fmt.currencyM(res.npv3Y);
    el.simRoi.textContent = fmt.percent(res.roi3Y);
    el.simNetBen.textContent = fmt.currencyM(res.threeYearGrossBenefit - res.threeYearTco);
    el.simPayback.textContent = res.paybackResult;
    el.simPaybackSub.textContent = `초기비 ₩${(res.initialTcoOneTime/1000).toFixed(1)}M / 월순편익 ₩${(res.netMonthlyBenefit/1000).toFixed(1)}M`;

    // Sliders Readouts
    el.valHourlyRate.textContent = `${fmt.currencyKRW(state.drivers.hourlyLaborRate)} 원/시`;
    el.valRealizationRate.textContent = fmt.percent(state.drivers.capacityRealizationRate);
    el.valDiscountRate.textContent = fmt.percent(state.drivers.discountRate);
    el.valAutoDelta.textContent = `${state.drivers.autoDelta > 0 ? "+" : ""}${state.drivers.autoDelta}%`;

    // 8 TCO Cost Category Bars
    renderTcoCategoryBars(res.threeYearTco);

    // 5 Benefit Category Bars
    renderBenefitCategoryBars(res.threeYearGrossBenefit, res.laborCapacityMonthly);

    // SVG Cashflow Curve
    renderCashflowSvg(res.cashFlowSchedule, res.paybackMonth);

    // Scenarios Table
    renderScenariosTable(res);
  }

  function renderTcoCategoryBars(totalTco3Y) {
    el.lblTotalTco3Y.textContent = fmt.currencyM(totalTco3Y);
    const groups = [
      { name: "1. 발견·설계", initial: 6000, monthly: 0 },
      { name: "2. 구축·통합", initial: 15500, monthly: 0 },
      { name: "3. 플랫폼·사용량", initial: 0, monthly: 950 },
      { name: "4. 운영·유지보수", initial: 0, monthly: 550 },
      { name: "5. 사람·변화관리", initial: 2000, monthly: 250 },
      { name: "6. 통제·컴플라이언스", initial: 1800, monthly: 150 },
      { name: "7. 공통비 배부", initial: 0, monthly: 300 },
      { name: "8. 종료·전환", initial: 1500, monthly: 0 }
    ];

    el.tcoGroupBars.innerHTML = groups.map(g => {
      const g3Y = g.initial + (g.monthly * 36);
      const pct = totalTco3Y > 0 ? (g3Y / totalTco3Y) * 100 : 0;
      return `
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>${g.name}</span>
            <span style="color: #38bdf8; font-weight: 600;">₩${(g3Y/1000).toFixed(1)}M (${pct.toFixed(1)}%)</span>
          </div>
          <div style="height: 5px; background: #0f172a; border-radius: 3px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: #3b82f6;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderBenefitCategoryBars(totalBen3Y, laborMonthly) {
    el.lblTotalBen3Y.textContent = fmt.currencyM(totalBen3Y);
    const items = [
      { name: "1. 생산성 가치 (실현계수 분리)", val3Y: laborMonthly * 36 },
      { name: "2. 직접 비용 절감 (외주/라이선스)", val3Y: (800 + 350) * 36 },
      { name: "3. 품질 개선 편익 (오류/재작업)", val3Y: 650 * 36 },
      { name: "4. 리스크 조정 편익 (SLA 위약)", val3Y: 541 * 36 },
      { name: "5. 매출/기회 편익 (가동시간)", val3Y: 500 * 36 }
    ];

    el.benGroupBars.innerHTML = items.map(b => {
      const pct = totalBen3Y > 0 ? (b.val3Y / totalBen3Y) * 100 : 0;
      return `
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>${b.name}</span>
            <span style="color: #34d399; font-weight: 600;">₩${(b.val3Y/1000).toFixed(1)}M (${pct.toFixed(1)}%)</span>
          </div>
          <div style="height: 5px; background: #0f172a; border-radius: 3px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: #10b981;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderCashflowSvg(schedule, paybackMonth) {
    const W = 800;
    const H = 240;
    const pad = 40;

    const values = schedule.map(s => s.cumDisc);
    const minVal = Math.min(...values, 0);
    const maxVal = Math.max(...values, 10000);

    const getY = (val) => {
      const range = maxVal - minVal;
      return H - pad - ((val - minVal) / range) * (H - pad * 2);
    };

    const getX = (m) => {
      return pad + (m / 36) * (W - pad * 2);
    };

    const zeroY = getY(0);

    // Build SVG Path
    let d = `M ${getX(0)} ${getY(schedule[0].cumDisc)}`;
    schedule.forEach(s => {
      d += ` L ${getX(s.m)} ${getY(s.cumDisc)}`;
    });

    // Zero Line & Payback Marker
    let paybackX = paybackMonth ? getX(paybackMonth) : null;

    let svgInner = `
      <!-- Grid Lines -->
      <line x1="${pad}" y1="${zeroY}" x2="${W - pad}" y2="${zeroY}" stroke="#64748b" stroke-dasharray="4,4" stroke-width="1.5" />
      <text x="${pad + 4}" y="${zeroY - 6}" fill="#94a3b8" font-size="11">Break-even Line (₩0)</text>

      <!-- Cashflow Curve -->
      <path d="${d}" fill="none" stroke="#38bdf8" stroke-width="3.5" />

      <!-- Area below curve to zero line -->
      <circle cx="${getX(0)}" cy="${getY(schedule[0].cumDisc)}" r="5" fill="#ef4444" />
      <circle cx="${getX(36)}" cy="${getY(schedule[36].cumDisc)}" r="6" fill="#34d399" />
    `;

    if (paybackX) {
      svgInner += `
        <line x1="${paybackX}" y1="${pad}" x2="${paybackX}" y2="${H - pad}" stroke="#f59e0b" stroke-width="2" />
        <circle cx="${paybackX}" cy="${zeroY}" r="6" fill="#f59e0b" />
        <text x="${paybackX + 6}" y="${pad + 15}" fill="#f59e0b" font-size="11" font-weight="700">회수 시점: M04 (${paybackMonth}개월)</text>
      `;
      el.lblPaybackMarker.textContent = `투자 회수 분기점: M${String(paybackMonth).padStart(2, "0")} (${paybackMonth}개월)`;
    } else {
      el.lblPaybackMarker.textContent = "투자 회수: 36개월 내 미회수";
    }

    el.cashflowSvg.innerHTML = svgInner;
  }

  function renderScenariosTable(baseRes) {
    const scens = [
      {
        id: "conservative",
        name: "보수적 (Conservative)",
        desc: "자동화율 50%, 비용 +15%, 편익 -25%",
        tco: baseRes.threeYearTco * 1.15,
        ben: baseRes.threeYearGrossBenefit * 0.75,
        roi: 1.45,
        pb: "6.8개월",
        purpose: "기본 헤드라인 및 리스크 심의"
      },
      {
        id: "baseline",
        name: "기준 (Baseline)",
        desc: "검증된 중앙값(69%), 표준 승인 TCO",
        tco: baseRes.threeYearTco,
        ben: baseRes.threeYearGrossBenefit,
        roi: baseRes.roi3Y,
        pb: baseRes.paybackResult,
        purpose: "투자 심의 및 본품의 의사결정"
      },
      {
        id: "aggressive",
        name: "공격적 (Aggressive)",
        desc: "사내 채택률 85%, 비용 -10%, 편익 +25%",
        tco: baseRes.threeYearTco * 0.90,
        ben: baseRes.threeYearGrossBenefit * 1.25,
        roi: 4.10,
        pb: "2.9개월",
        purpose: "최대 상한 포텐셜 및 비즈니스 케이스"
      }
    ];

    el.scenarioTableBody.innerHTML = scens.map(s => {
      const net = s.ben - s.tco;
      const isCurrent = s.id === state.scenario;
      return `
        <tr style="${isCurrent ? "background: rgba(59, 130, 246, 0.15); font-weight: 700;" : ""}">
          <td style="color: ${s.id === 'conservative' ? '#f59e0b' : (s.id === 'baseline' ? '#60a5fa' : '#34d399')};">${s.name}</td>
          <td style="font-size: 0.75rem; color: var(--text-dim);">${s.desc}</td>
          <td style="text-align: right;">${fmt.currencyM(s.tco)}</td>
          <td style="text-align: right; color: #34d399;">${fmt.currencyM(s.ben)}</td>
          <td style="text-align: right; color: #fff;">${fmt.currencyM(net)}</td>
          <td style="text-align: right; color: #38bdf8;">${fmt.percent(s.roi)}</td>
          <td style="text-align: right; color: #fbbf24;">${s.pb}</td>
          <td style="font-size: 0.75rem; color: var(--text-dim);">${s.purpose}</td>
        </tr>
      `;
    }).join("");
  }

  // Sliders Change Bindings
  el.sliderHourlyRate.addEventListener("input", (e) => {
    state.drivers.hourlyLaborRate = Number(e.target.value);
    renderRoiSimulator();
  });
  el.sliderRealizationRate.addEventListener("input", (e) => {
    state.drivers.capacityRealizationRate = Number(e.target.value) / 100;
    renderRoiSimulator();
  });
  el.sliderDiscountRate.addEventListener("input", (e) => {
    state.drivers.discountRate = Number(e.target.value) / 100;
    renderRoiSimulator();
  });
  el.sliderAutoDelta.addEventListener("input", (e) => {
    state.drivers.autoDelta = Number(e.target.value);
    renderRoiSimulator();
  });
  el.roiScenarioSelector.addEventListener("change", (e) => {
    state.scenario = e.target.value;
    renderRoiSimulator();
    addAuditLog("SCENARIO_CHANGED", state.currentCaseId, `시나리오를 '${state.scenario}'로 전환 시뮬레이션`);
  });

  // --- Module 6: Value Realization (KPI Tracking) ---
  function renderRealization() {
    el.realizationTableBody.innerHTML = window.AX_DATA.kpiTracking.map(k => {
      const achRate = k.rev 
        ? (k.actual > 0 ? (k.target / k.actual) : 1.0)
        : (k.target > 0 ? (k.actual / k.target) : 1.0);
      
      const variance = k.baseline > 0
        ? (k.actual - k.baseline) / k.baseline
        : (k.actual - k.target) / k.target;

      const isSuccess = achRate >= 1.0;
      const statusBadge = isSuccess ? "badge-green" : (achRate >= 0.85 ? "badge-amber" : "badge-red");
      const statusText = isSuccess ? "목표 달성" : (achRate >= 0.85 ? "주의 관찰" : "미달 관리");

      return `
        <tr>
          <td style="text-align: center; color: var(--text-dim);">${k.no}</td>
          <td><strong style="color: #fff;">${k.kpi}</strong></td>
          <td><span class="badge badge-blue">${k.type}</span></td>
          <td style="text-align: right; color: var(--text-dim);">${k.baseline.toFixed(1)} ${k.unit}</td>
          <td style="text-align: right; color: #94a3b8;">${k.target.toFixed(1)} ${k.unit}</td>
          <td style="text-align: right; font-weight: 700; color: #38bdf8;">${k.actual.toFixed(1)} ${k.unit}</td>
          <td style="text-align: right; font-weight: 700; color: ${isSuccess ? '#34d399' : '#f59e0b'};">${(achRate * 100).toFixed(1)}%</td>
          <td style="text-align: right; color: var(--text-dim);">${(variance * 100).toFixed(1)}%</td>
          <td style="text-align: center;"><span class="badge ${statusBadge}">${statusText}</span></td>
          <td style="font-size: 0.78rem; color: #cbd5e1;">${k.note}</td>
        </tr>
      `;
    }).join("");
  }

  el.btnRecordActual.addEventListener("click", () => {
    alert("실제 운영 측정치 수집 커넥터 (M365, ITSM, CloudWatch API) 연동 준비 상태입니다. 수동 실측치 업데이트는 분기 결산 시 반영됩니다.");
  });

  // --- Module 7: Governance & Audit Logs ---
  function renderAuditLogs() {
    el.auditTableBody.innerHTML = state.auditLogs.map(log => `
      <tr>
        <td style="font-family: monospace; font-size: 0.75rem; color: #38bdf8;">${log.id}</td>
        <td style="font-size: 0.75rem; color: var(--text-muted);">${log.time}</td>
        <td><strong>${log.actor}</strong></td>
        <td><span class="badge badge-blue" style="font-size: 0.68rem;">${log.role}</span></td>
        <td><span class="badge badge-purple" style="font-size: 0.68rem;">${log.action}</span></td>
        <td style="font-family: monospace; color: #fbbf24;">${log.obj}</td>
        <td style="font-size: 0.78rem; color: #cbd5e1;">${log.desc}</td>
      </tr>
    `).join("");
  }

  function addAuditLog(action, obj, desc) {
    const r = roles[state.currentRole] || roles.owner;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ` +
                    `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

    state.auditLogs.unshift({
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      time: timeStr,
      actor: `${r.name} (${state.currentRole})`,
      role: r.label,
      action: action,
      obj: obj,
      desc: desc
    });

    if (state.activeTab === "tab-governance") renderAuditLogs();
  }

  // --- Module 8: Executive Report ---
  function renderExecutiveReport() {
    el.reportSummaryTable.innerHTML = state.useCases.slice(0, 7).map(c => `
      <tr>
        <td><strong>${c.title}</strong></td>
        <td>${c.org}</td>
        <td><span class="badge badge-blue">${c.stage} (${c.gate})</span></td>
        <td style="text-align: right; color: #34d399; font-weight: 600;">${fmt.currencyKRW(c.annualNet)} 천원</td>
        <td style="text-align: right;">${fmt.currencyKRW(c.threeYearTco)} 천원</td>
        <td style="text-align: right; font-weight: 700; color: #38bdf8;">${fmt.percent(c.threeYearRoi)}</td>
        <td style="text-align: right;">${c.paybackMonths ? c.paybackMonths.toFixed(1) + "개월" : "회수 불가"}</td>
        <td><span class="badge ${c.status === "Approved" || c.status === "In-Ops" ? "badge-green" : "badge-amber"}">${c.status}</span></td>
      </tr>
    `).join("");
  }

  // Global Full Render
  function renderAll() {
    renderHomeKpis();
    renderCatalog();
    renderWorkflowStudio();
    renderPortfolio();
    renderRoiSimulator();
    renderRealization();
    renderAuditLogs();
    renderExecutiveReport();
  }

  // Initial Boot
  renderAll();
});

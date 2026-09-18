/**
 * AX PORTFOLIO MANAGER + AI ROI SIMULATOR
 * Core Application Engine (PRD v3.0)
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Global Application State ---
  const state = {
    useCases: JSON.parse(JSON.stringify(window.AX_DATA.initialUseCases)),
    currentCaseId: "UC-2026-001",
    currentOrg: "all",
    currentRole: "all",
    currentWorkflowSteps: JSON.parse(JSON.stringify(window.AX_DATA.templates[0].steps)),
    tcoItems: JSON.parse(JSON.stringify(window.AX_DATA.defaultTcoBreakdown)),
    directBenefits: JSON.parse(JSON.stringify(window.AX_DATA.defaultDirectBenefits)),
    drivers: { ...window.AX_DATA.defaultBenefitDrivers, autoDelta: 0 },
    scenario: "baseline",
    activeTab: "tab-home",
    isMobileAppMode: false,
    auditLogs: JSON.parse(JSON.stringify(window.AX_DATA.auditLogs)),
    deferredPrompt: null
  };

  // --- DOM Elements Cache ---
  const el = {
    orgSelector: document.getElementById("orgSelector"),
    roleSelector: document.getElementById("roleSelector"),
    portfolioOrgFilter: document.getElementById("portfolioOrgFilter"),
    portfolioRoleFilter: document.getElementById("portfolioRoleFilter"),
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
    kpiTotalCasesSub: document.getElementById("kpiTotalCasesSub"),
    kpiTotalNetBenefit: document.getElementById("kpiTotalNetBenefit"),
    kpiTotalNetBenefitSub: document.getElementById("kpiTotalNetBenefitSub"),
    kpiAvgRoi: document.getElementById("kpiAvgRoi"),
    kpiAvgRoiSub: document.getElementById("kpiAvgRoiSub"),
    kpiPendingGates: document.getElementById("kpiPendingGates"),
    kpiPendingGatesSub: document.getElementById("kpiPendingGatesSub"),
    homeSpotlightCard: document.getElementById("homeSpotlightCard"),
    homeSpotlightTitleText: document.getElementById("homeSpotlightTitleText"),
    homeSpotlightScopeBadge: document.getElementById("homeSpotlightScopeBadge"),
    homeSpotlightStage: document.getElementById("homeSpotlightStage"),
    homeSpotlightOrg: document.getElementById("homeSpotlightOrg"),
    homeSpotlightBenefit: document.getElementById("homeSpotlightBenefit"),
    homeSpotlightTco: document.getElementById("homeSpotlightTco"),
    homeSpotlightPattern: document.getElementById("homeSpotlightPattern"),
    homeSpotlightRisk: document.getElementById("homeSpotlightRisk"),
    homeUserCaseList: document.getElementById("homeUserCaseList"),

    // Catalog
    searchCatalog: document.getElementById("searchCatalog"),
    filterCategory: document.getElementById("filterCategory"),
    catalogCardsContainer: document.getElementById("catalogCardsContainer"),

    // Workflow Studio
    wfStudioTitle: document.getElementById("wfStudioTitle"),
    wfCaseSelector: document.getElementById("wfCaseSelector"),
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
    portfolioUserFilter: document.getElementById("portfolioUserFilter"),
    portfolioFilterBadge: document.getElementById("portfolioFilterBadge"),
    btnResetPortfolioFilter: document.getElementById("btnResetPortfolioFilter"),

    // ROI Simulator
    roiCaseTitle: document.getElementById("roiCaseTitle"),
    roiCaseSelector: document.getElementById("roiCaseSelector"),
    roiScenarioSelector: document.getElementById("roiScenarioSelector"),
    btnExportMemo: document.getElementById("btnExportMemo"),
    btnExportAudit: document.getElementById("btnExportAudit"),
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
    reportScopeBadge: document.getElementById("reportScopeBadge"),

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
    if (tabId === "tab-catalog") {
      if (el.filterCategory && state.currentOrg !== "all") {
        el.filterCategory.value = state.currentOrg;
      }
      renderCatalog();
    }
    if (tabId === "tab-roi") renderRoiSimulator();
    if (tabId === "tab-portfolio") renderPortfolio();
    if (tabId === "tab-workflow") renderWorkflowStudio();
    if (tabId === "tab-realization") renderRealization();
    if (tabId === "tab-governance") renderAuditLogs();
    if (tabId === "tab-reports") renderExecutiveReport();
    if (tabId === "tab-home") {
      renderHomeKpis();
      renderHomeSpotlight();
    }
  }

  // Bind Nav Events
  el.navItems.forEach(item => {
    item.addEventListener("click", () => switchTab(item.getAttribute("data-tab")));
  });
  el.mobileNavBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
  });

  // --- Organization & Role Master Engine ---
  const orgsMaster = [
    { id: "all", name: "전사 조직", shortName: "전사", code: "ALL", desc: "전체 8대 부문 포괄 (26건)" },
    { id: "it_data", name: "정보기술·데이터", shortName: "IT/데이터", code: "IT", desc: "IT 운영, 데이터 품질, AI CoE (5건)" },
    { id: "sec_privacy", name: "보안·개인정보", shortName: "보안/개인정보", code: "SEC", desc: "SIEM, 취약점 관리, 개인정보 (3건)" },
    { id: "rnd", name: "연구개발 (R&D)", shortName: "연구개발", code: "R&D", desc: "선행기술, 논문·특허, 실험노트 (2건)" },
    { id: "scm_prod", name: "생산·공급망 (SCM)", shortName: "생산/공급망", code: "SCM", desc: "작업일보, 설비예지보전, 견적비교 (3건)" },
    { id: "qa_ra", name: "품질·규제 (QA/RA)", shortName: "품질/규제", code: "QA", desc: "규제문서, 일탈/CAPA, GxP 감사증적 (3건)" },
    { id: "sales_mkt", name: "영업·마케팅·고객", shortName: "영업/마케팅", code: "SALES", desc: "제안서 초안, VOC 감성, 지능형상담 (3건)" },
    { id: "fin_legal", name: "재무·법무", shortName: "재무/법무", code: "FIN", desc: "결산분석, 비용감사, 계약서 독소조항 (3건)" },
    { id: "hr_admin", name: "인사·총무·경영", shortName: "인사/경영", code: "HR", desc: "온보딩 가이드, 교육콘텐츠, 경영브리핑 (4건)" }
  ];

  const rolesMaster = [
    { id: "all", name: "전체 역할", label: "전체 역할 (All Roles)", avatar: "ALL", desc: "모든 역할 관점" },
    { id: "owner", name: "Business Owner", label: "Business Owner (현업 조직장/부서장)", avatar: "BO", desc: "과제 발굴 및 실무 워크플로우 책임" },
    { id: "lead", name: "Tech Lead", label: "Tech Lead (실무/엔지니어링 리드)", avatar: "TL", desc: "AI 모델, 연동 및 기술 아키텍처 구현" },
    { id: "pmo", name: "AX/AI PMO", label: "AX/AI PMO (전사 기획 및 총괄 관리자)", avatar: "PMO", desc: "전사 과제 승인, 우선순위 및 거버넌스" },
    { id: "finance", name: "Finance Reviewer", label: "Finance Reviewer (재무 심의위원)", avatar: "FIN", desc: "TCO/편익 타당성 및 ROI/회수기간 심의" },
    { id: "risk", name: "Risk/Security Officer", label: "Risk/Security Officer (보안·규제 감사관)", avatar: "RSK", desc: "위험 등급(Tier 1~3), 컴플라이언스 및 HITL 통제" },
    { id: "exec", name: "Executive", label: "Executive (경영진 / C-Level)", avatar: "EXC", desc: "전사 전략 정합성 및 최종 투자 의사결정" }
  ];

  function getOrgObj(orgKey) {
    return orgsMaster.find(o => o.id === orgKey) || orgsMaster[0];
  }

  function getRoleObj(roleKey) {
    return rolesMaster.find(r => r.id === roleKey) || rolesMaster[0];
  }

  function getFilteredUseCases(orgKey, roleKey) {
    const org = orgKey !== undefined ? orgKey : state.currentOrg;
    const role = roleKey !== undefined ? roleKey : state.currentRole;

    let list = state.useCases;

    // 1. Organization Filter
    if (org && org !== "all") {
      const orgObj = getOrgObj(org);
      list = list.filter(c => c.catId === org || (c.org && (c.org === orgObj.name || c.org.includes(orgObj.shortName))));
    }

    // 2. Role Filter (Multi-perspective filtering)
    if (role && role !== "all") {
      if (role === "owner") {
        list = list.filter(c => c.role === "owner" || (c.roleTitle && c.roleTitle.includes("Owner")));
      } else if (role === "lead") {
        list = list.filter(c => c.role === "lead" || (c.roleTitle && c.roleTitle.includes("Lead")));
      } else if (role === "risk") {
        list = list.filter(c => c.role === "risk" || (c.roleTitle && c.roleTitle.includes("Risk")) || (c.riskTier && c.riskTier.includes("Tier 1")));
      } else if (role === "finance") {
        list = list.filter(c => c.role === "finance" || (c.roleTitle && c.roleTitle.includes("Finance")) || (c.annualTco && c.annualTco >= 35000));
      } else if (role === "pmo") {
        list = list.filter(c => c.role === "pmo" || (c.roleTitle && c.roleTitle.includes("PMO")) || c.priorityScore >= 8.3);
      } else if (role === "exec") {
        list = list.filter(c => c.role === "exec" || (c.roleTitle && c.roleTitle.includes("Executive")) || c.priorityScore >= 8.2);
      }
    }

    return list;
  }

  function populateCaseDropdowns() {
    const filteredCases = getFilteredUseCases();
    const casesToShow = filteredCases.length > 0 ? filteredCases : state.useCases;

    const optionsHtml = casesToShow.map(c => `
      <option value="${c.id}" ${c.id === state.currentCaseId ? "selected" : ""}>
        [${c.id}] ${c.title} (${c.org} · ${c.roleTitle || c.owner})
      </option>
    `).join("");

    if (el.roiCaseSelector) {
      el.roiCaseSelector.innerHTML = optionsHtml;
      el.roiCaseSelector.value = state.currentCaseId;
    }
    if (el.wfCaseSelector) {
      el.wfCaseSelector.innerHTML = optionsHtml;
      el.wfCaseSelector.value = state.currentCaseId;
    }
  }

  function loadCaseIntoWorkspace(caseId, triggerRender = true) {
    if (!caseId) return;
    const curr = state.useCases.find(c => c.id === caseId);
    if (!curr) return;

    state.currentCaseId = caseId;

    // Load template steps if matching template exists
    if (curr.templateId) {
      const tmpl = window.AX_DATA.templates.find(t => t.id === curr.templateId);
      if (tmpl && tmpl.steps) {
        state.currentWorkflowSteps = JSON.parse(JSON.stringify(tmpl.steps));
      }
    }

    // Scale TCO & Direct Benefits proportionally to reflect current case parameters
    const tcoRatio = curr.annualTco ? (curr.annualTco / 27900) : 1.0;
    state.tcoItems = window.AX_DATA.defaultTcoBreakdown.map(item => ({
      ...item,
      initial: Math.round(item.initial * tcoRatio),
      monthly: Math.round(item.monthly * tcoRatio)
    }));

    const benRatio = curr.annualBenefit ? (curr.annualBenefit / 95532) : 1.0;
    state.directBenefits = window.AX_DATA.defaultDirectBenefits.map(b => ({
      ...b,
      monthly: Math.round(b.monthly * benRatio)
    }));

    if (el.wfStudioTitle) {
      el.wfStudioTitle.textContent = `[${curr.id}] ${curr.title}`;
    }
    if (el.roiCaseTitle) {
      el.roiCaseTitle.textContent = `[${curr.id}] ${curr.title} ROI 시뮬레이션 (${state.scenario.toUpperCase()})`;
    }
    if (el.roiCaseSelector && el.roiCaseSelector.value !== caseId) {
      el.roiCaseSelector.value = caseId;
    }
    if (el.wfCaseSelector && el.wfCaseSelector.value !== caseId) {
      el.wfCaseSelector.value = caseId;
    }

    if (triggerRender) {
      if (state.activeTab === "tab-roi") renderRoiSimulator();
      if (state.activeTab === "tab-workflow") renderWorkflowStudio();
      if (state.activeTab === "tab-home") renderHomeSpotlight();
    }
  }

  function setOrgAndRole(orgKey, roleKey) {
    state.currentOrg = orgKey || "all";
    state.currentRole = roleKey || "all";

    const orgObj = getOrgObj(state.currentOrg);
    const roleObj = getRoleObj(state.currentRole);

    // Sync Top Bar Dropdowns
    if (el.orgSelector && el.orgSelector.value !== state.currentOrg) {
      el.orgSelector.value = state.currentOrg;
    }
    if (el.roleSelector && el.roleSelector.value !== state.currentRole) {
      el.roleSelector.value = state.currentRole;
    }

    // Sync Portfolio Filter Bar Dropdowns
    if (el.portfolioOrgFilter && el.portfolioOrgFilter.value !== state.currentOrg) {
      el.portfolioOrgFilter.value = state.currentOrg;
    }
    if (el.portfolioRoleFilter && el.portfolioRoleFilter.value !== state.currentRole) {
      el.portfolioRoleFilter.value = state.currentRole;
    }

    // Update Sidebar Profile Card
    if (el.currentUserName) {
      el.currentUserName.textContent = state.currentOrg === "all" ? "전사 조직 (All Units)" : orgObj.name;
    }
    if (el.currentUserRoleBadge) {
      el.currentUserRoleBadge.textContent = state.currentRole === "all" ? "전체 역할 (All Roles)" : roleObj.name;
    }
    if (el.avatarIcon) {
      el.avatarIcon.textContent = state.currentOrg !== "all" ? orgObj.code : roleObj.avatar;
    }

    // Filter use cases
    const filtered = getFilteredUseCases(state.currentOrg, state.currentRole);
    if (filtered.length > 0) {
      const exists = filtered.some(c => c.id === state.currentCaseId);
      if (!exists) {
        state.currentCaseId = filtered[0].id;
      }
      loadCaseIntoWorkspace(state.currentCaseId, false);
    }

    populateCaseDropdowns();

    // Sync Catalog Filter
    if (el.filterCategory) {
      el.filterCategory.value = state.currentOrg !== "all" ? state.currentOrg : "all";
    }

    // Re-render UI components according to active filters
    renderHomeKpis();
    renderHomeSpotlight();
    renderCatalog();
    renderPortfolio();
    renderRoiSimulator();
    renderWorkflowStudio();
    renderExecutiveReport();

    addAuditLog("FILTER_CHANGED", "SYSTEM", `조직을 '${orgObj.name}', 역할을 '${roleObj.name}'로 전환 (표시 과제: ${filtered.length}건)`);
  }

  // Bind Dual Selectors Events
  if (el.orgSelector) {
    el.orgSelector.addEventListener("change", (e) => setOrgAndRole(e.target.value, state.currentRole));
  }
  if (el.roleSelector) {
    el.roleSelector.addEventListener("change", (e) => setOrgAndRole(state.currentOrg, e.target.value));
  }
  if (el.portfolioOrgFilter) {
    el.portfolioOrgFilter.addEventListener("change", (e) => setOrgAndRole(e.target.value, state.currentRole));
  }
  if (el.portfolioRoleFilter) {
    el.portfolioRoleFilter.addEventListener("change", (e) => setOrgAndRole(state.currentOrg, e.target.value));
  }
  if (el.btnResetPortfolioFilter) {
    el.btnResetPortfolioFilter.addEventListener("click", () => setOrgAndRole("all", "all"));
  }
  if (el.roiCaseSelector) {
    el.roiCaseSelector.addEventListener("change", (e) => loadCaseIntoWorkspace(e.target.value));
  }
  if (el.wfCaseSelector) {
    el.wfCaseSelector.addEventListener("change", (e) => loadCaseIntoWorkspace(e.target.value));
  }


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
  if (el.btnResetData) {
    el.btnResetData.addEventListener("click", () => {
      if (confirm("기본 시뮬레이션 및 26개 포트폴리오 데이터를 초기화하시겠습니까?")) {
        state.useCases = JSON.parse(JSON.stringify(window.AX_DATA.initialUseCases));
        state.currentWorkflowSteps = JSON.parse(JSON.stringify(window.AX_DATA.templates[0].steps));
        state.drivers = { ...window.AX_DATA.defaultBenefitDrivers, autoDelta: 0 };
        state.currentCaseId = "UC-2026-001";
        state.scenario = "baseline";
        if (el.roiScenarioSelector) el.roiScenarioSelector.value = "baseline";
        if (el.searchCatalog) el.searchCatalog.value = "";
        setOrgAndRole("all", "all");
        addAuditLog("DATA_RESET", "SYSTEM", "전사 26개 과제 마스터 데이터셋 및 시뮬레이션 초기화");
        alert("데이터가 성공적으로 초기화되었습니다.");
      }
    });
  }

  // --- Module 1: Home Screen ---
  function renderHomeKpis() {
    const filteredCases = getFilteredUseCases();
    const casesToAnalyze = filteredCases.length > 0 ? filteredCases : state.useCases;
    const orgObj = getOrgObj(state.currentOrg);
    const roleObj = getRoleObj(state.currentRole);

    const totalCases = casesToAnalyze.length;
    const inOps = casesToAnalyze.filter(c => c.stage === "Production" || c.stage === "Optimize").length;
    const inPilot = casesToAnalyze.filter(c => c.stage === "Pilot").length;
    const inPoc = casesToAnalyze.filter(c => c.stage === "PoC").length;
    const inScreen = casesToAnalyze.filter(c => c.stage === "Screening" || c.stage === "Assessment" || c.stage === "Idea").length;

    const total3YNetBen = casesToAnalyze.reduce((sum, c) => sum + (c.annualNet * 3 - (c.threeYearTco - c.annualTco)), 0);
    const total3YTco = casesToAnalyze.reduce((sum, c) => sum + c.threeYearTco, 0);
    const avgRoi = casesToAnalyze.reduce((sum, c) => sum + c.threeYearRoi, 0) / (totalCases || 1);
    const avgPayback = casesToAnalyze.reduce((sum, c) => sum + (c.paybackMonths || 12), 0) / (totalCases || 1);
    const pendingGates = casesToAnalyze.filter(c => c.gate.includes("대기") || c.status === "Reviewing" || c.status === "Submitted").length;

    if (el.kpiTotalCases) el.kpiTotalCases.textContent = `${totalCases} 건`;
    if (el.kpiTotalCasesSub) {
      el.kpiTotalCasesSub.textContent = (state.currentOrg === "all" && state.currentRole === "all")
        ? `운영 ${inOps}건 / Pilot ${inPilot}건 / PoC ${inPoc}건 / 초기 ${inScreen}건`
        : `${orgObj.shortName} · ${roleObj.name} 관점 필터링`;
    }
    if (el.kpiTotalNetBenefit) el.kpiTotalNetBenefit.textContent = fmt.currencyM(total3YNetBen);
    if (el.kpiTotalNetBenefitSub) el.kpiTotalNetBenefitSub.textContent = `총 TCO: ${fmt.currencyM(total3YTco)}`;
    if (el.kpiAvgRoi) el.kpiAvgRoi.textContent = fmt.percent(avgRoi);
    if (el.kpiAvgRoiSub) el.kpiAvgRoiSub.textContent = `평균 회수: ${avgPayback.toFixed(1)}개월`;
    if (el.kpiPendingGates) el.kpiPendingGates.textContent = `${pendingGates} 건`;
    if (el.kpiPendingGatesSub) {
      el.kpiPendingGatesSub.textContent = pendingGates > 0 ? `게이트 심의 대기 ${pendingGates}건` : "대기 안건 없음 (정상 운영)";
    }
  }

  function renderHomeSpotlight() {
    const filteredCases = getFilteredUseCases();
    const activeCase = filteredCases.find(c => c.id === state.currentCaseId) || filteredCases[0] || state.useCases[0];
    if (!activeCase) return;

    const orgObj = getOrgObj(state.currentOrg);
    const roleObj = getRoleObj(state.currentRole);

    if (el.homeSpotlightTitleText) {
      el.homeSpotlightTitleText.textContent = `대표 추진 과제 심층 현황: [${activeCase.id}] ${activeCase.title}`;
    }
    if (el.homeSpotlightScopeBadge) {
      el.homeSpotlightScopeBadge.textContent = `담당: ${activeCase.roleTitle || activeCase.owner} (${activeCase.org})`;
    }
    if (el.homeSpotlightStage) {
      el.homeSpotlightStage.textContent = `${activeCase.stage} (${activeCase.gate})`;
    }
    if (el.homeSpotlightOrg) {
      el.homeSpotlightOrg.textContent = `주관: ${activeCase.org} (${activeCase.roleTitle || activeCase.owner})`;
    }
    if (el.homeSpotlightBenefit) {
      el.homeSpotlightBenefit.textContent = `₩${fmt.currencyKRW(activeCase.annualNet)} 천원 / ${activeCase.paybackMonths ? activeCase.paybackMonths.toFixed(1) + "개월" : "회수 불가"}`;
    }
    if (el.homeSpotlightTco) {
      el.homeSpotlightTco.textContent = `1년 TCO: ₩${(activeCase.annualTco/1000).toFixed(1)}M | 3년 ROI: ${fmt.percent(activeCase.threeYearRoi)}`;
    }
    if (el.homeSpotlightPattern) {
      el.homeSpotlightPattern.textContent = activeCase.desc ? (activeCase.desc.length > 40 ? activeCase.desc.slice(0, 40) + "..." : activeCase.desc) : "표준 워크플로우";
    }
    if (el.homeSpotlightRisk) {
      el.homeSpotlightRisk.textContent = `신뢰도: B등급 (검증됨) | 위험: ${activeCase.riskTier.split(" ")[0]}`;
    }

    // Dynamic case listing for the selected filters on Home
    if (el.homeUserCaseList) {
      if (filteredCases.length > 0) {
        el.homeUserCaseList.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
            <span>📋 <strong>${orgObj.name} · ${roleObj.name}</strong> 대상 과제 목록 (${filteredCases.length}건):</span>
            <span style="font-size: 0.72rem; color: var(--text-dim);">과제 클릭 시 즉시 시뮬레이션 워크스페이스에 로드됩니다</span>
          </div>
          <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
            ${filteredCases.map(c => `
              <button class="btn btn-sm btn-home-case-chip ${c.id === activeCase.id ? "btn-primary" : "btn-outline"}" data-id="${c.id}" style="padding: 3px 8px; font-size: 0.74rem;">
                <strong>${c.id}</strong> ${c.title.length > 18 ? c.title.slice(0, 18) + '...' : c.title}
                <span style="opacity: 0.85; margin-left: 3px; font-size: 0.68rem;">[${c.stage}]</span>
              </button>
            `).join("")}
          </div>
        `;
        document.querySelectorAll(".btn-home-case-chip").forEach(btn => {
          btn.addEventListener("click", () => {
            const cid = btn.getAttribute("data-id");
            loadCaseIntoWorkspace(cid);
          });
        });
      } else {
        el.homeUserCaseList.innerHTML = `
          <div style="padding: 0.5rem; color: var(--text-muted); font-size: 0.8rem;">
            선택된 필터에 해당하는 과제가 없습니다. 상단에서 다른 조직이나 역할을 선택해보세요.
          </div>
        `;
      }
    }
  }

  // --- Home Interactive Button Bindings ---
  if (el.btnGoFlagshipRoi) {
    el.btnGoFlagshipRoi.addEventListener("click", () => {
      const filteredCases = getFilteredUseCases();
      const targetCase = filteredCases.find(c => c.id === state.currentCaseId) || filteredCases[0] || state.useCases[0];
      if (targetCase) {
        loadCaseIntoWorkspace(targetCase.id, true);
      }
      switchTab("tab-roi");
    });
  }

  if (el.cardBrowseOrg) {
    el.cardBrowseOrg.addEventListener("click", (e) => {
      const badge = (e.target && typeof e.target.closest === "function") ? e.target.closest(".btn-home-org-filter") : null;
      if (badge && typeof badge.getAttribute === "function") {
        const cat = badge.getAttribute("data-cat");
        if (cat) setOrgAndRole(cat, state.currentRole);
      }
      switchTab("tab-catalog");
    });
  }

  if (el.btnHomeDecompose) {
    el.btnHomeDecompose.addEventListener("click", () => {
      const desc = (el.inputHomeWorkDesc ? el.inputHomeWorkDesc.value : "").trim();
      if (!desc) {
        alert("분석할 업무 내용을 간단히 입력해주세요.");
        return;
      }
      aiDecomposeWorkflow(desc);
      switchTab("tab-workflow");
    });
  }

  if (el.inputHomeWorkDesc) {
    el.inputHomeWorkDesc.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const desc = el.inputHomeWorkDesc.value.trim();
        if (desc) {
          aiDecomposeWorkflow(desc);
          switchTab("tab-workflow");
        }
      }
    });
  }

  // --- Module 2: Standard Catalog Engine ---
  function renderCatalog() {
    if (!el.catalogCardsContainer) return;

    const query = (el.searchCatalog ? el.searchCatalog.value || "" : "").toLowerCase().trim();
    const catFilter = el.filterCategory ? el.filterCategory.value : "all";

    const filtered = window.AX_DATA.templates.filter(t => {
      const matchCat = (catFilter === "all" || t.catId === catFilter);
      const matchQuery = !query || 
                         t.title.toLowerCase().includes(query) || 
                         t.desc.toLowerCase().includes(query) || 
                         t.pattern.toLowerCase().includes(query) ||
                         t.workflow.toLowerCase().includes(query) ||
                         t.catName.toLowerCase().includes(query) ||
                         t.id.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      el.catalogCardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px;">
          <div style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 0.5rem;">
            🔍 조건에 일치하는 표준 업무 템플릿이 없습니다.
          </div>
          <p style="font-size: 0.85rem; margin-bottom: 1.25rem;">다른 검색어를 입력하시거나 카테고리 필터를 '전체 기능 영역'으로 변경해보세요.</p>
          <button class="btn btn-primary btn-sm" id="btnResetCatalogFilter">
            🔄 전체 26개 템플릿 보기
          </button>
        </div>
      `;
      const btnResetCat = document.getElementById("btnResetCatalogFilter");
      if (btnResetCat) {
        btnResetCat.addEventListener("click", () => {
          if (el.searchCatalog) el.searchCatalog.value = "";
          if (el.filterCategory) el.filterCategory.value = "all";
          renderCatalog();
        });
      }
      return;
    }

    el.catalogCardsContainer.innerHTML = filtered.map(t => {
      const matchUc = state.useCases.find(c => c.templateId === t.id);
      return `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 3px solid #3b82f6;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
              <div>
                <span class="badge badge-blue" style="margin-bottom: 4px;">${t.catName} · [${t.id}]</span>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-top: 2px;">${t.title}</h4>
              </div>
              <span class="badge ${t.riskTier.includes("Tier 1") ? "badge-red" : (t.riskTier.includes("Tier 2") ? "badge-amber" : "badge-green")}">
                ${t.riskTier}
              </span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.45;">${t.desc}</p>
            
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 0.6rem; font-size: 0.75rem; margin-bottom: 0.75rem; line-height: 1.45;">
              <div style="color: #93c5fd; font-weight: 600; margin-bottom: 2px;">기본 워크플로우 (${t.steps.length}단계):</div>
              <div style="color: #cbd5e1;">${t.workflow}</div>
            </div>

            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; font-size: 0.74rem; color: var(--text-dim); margin-bottom: 1rem; background: rgba(255,255,255,0.02); padding: 6px 8px; border-radius: 4px;">
              <span>🤖 AI 패턴: <strong style="color:#e2e8f0;">${t.pattern}</strong></span>
              <span>⚡ 예상 자동화율: <strong style="color:#38bdf8;">${(t.autoRate * 100).toFixed(0)}%</strong></span>
              <span>⏱️ 건당 기준: <strong style="color:#e2e8f0;">${t.baseMin}분</strong></span>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-size: 0.74rem; color: var(--text-dim);">월 평균 ${t.avgVolume}건 처리</span>
            <div style="display: flex; gap: 0.4rem;">
              ${matchUc ? `
                <button class="btn btn-secondary btn-sm btn-catalog-roi" data-case-id="${matchUc.id}" title="[${matchUc.id}] ROI 시뮬레이터로 바로 이동">
                  📊 ROI 분석
                </button>
              ` : ""}
              <button class="btn btn-primary btn-sm btn-use-template" data-tmpl-id="${t.id}" title="Workflow Studio에서 6단계 워크플로우를 편집하고 과제로 등록">
                이 템플릿으로 시작 →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind Template Selection
    document.querySelectorAll(".btn-use-template").forEach(btn => {
      btn.addEventListener("click", () => {
        const tmplId = btn.getAttribute("data-tmpl-id");
        applyTemplateToStudio(tmplId);
      });
    });

    // Bind Quick ROI Simulation jump
    document.querySelectorAll(".btn-catalog-roi").forEach(btn => {
      btn.addEventListener("click", () => {
        const cid = btn.getAttribute("data-case-id");
        loadCaseIntoWorkspace(cid, true);
        switchTab("tab-roi");
      });
    });
  }

  if (el.searchCatalog) {
    el.searchCatalog.addEventListener("input", renderCatalog);
  }
  if (el.filterCategory) {
    el.filterCategory.addEventListener("change", renderCatalog);
  }

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
    const curOrgObj = getOrgObj(state.currentOrg);
    const curRoleObj = getRoleObj(state.currentRole);
    const newCase = {
      id: newId,
      title: title || "신규 발굴 AI 과제",
      org: state.currentOrg !== "all" ? curOrgObj.name : "정보기술·데이터",
      catId: state.currentOrg !== "all" ? state.currentOrg : "it_data",
      owner: curRoleObj.name,
      role: state.currentRole !== "all" ? state.currentRole : "owner",
      roleTitle: `${curRoleObj.name} (${curOrgObj.shortName})`,
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
    populateCaseDropdowns();
    setOrgAndRole(newCase.catId, newCase.role);
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
    const filteredCases = getFilteredUseCases();
    const orgObj = getOrgObj(state.currentOrg);
    const roleObj = getRoleObj(state.currentRole);
    const isFiltered = state.currentOrg !== "all" || state.currentRole !== "all";

    // Update filter badge & reset button
    if (el.portfolioFilterBadge) {
      el.portfolioFilterBadge.textContent = isFiltered
        ? `표시 중: ${filteredCases.length}건 / 전체 ${state.useCases.length}건 (${orgObj.shortName} · ${roleObj.name})`
        : `전체 표시 중: ${state.useCases.length}건 (8대 부문 26개 과제)`;
    }
    if (el.btnResetPortfolioFilter) {
      el.btnResetPortfolioFilter.style.display = isFiltered ? "inline-flex" : "none";
    }

    if (filteredCases.length === 0) {
      el.portfolioTableBody.innerHTML = `
        <tr>
          <td colspan="14" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <div style="font-size: 1.05rem; margin-bottom: 0.4rem; color: #cbd5e1;">
              선택된 조건 (<strong>${orgObj.name} · ${roleObj.name}</strong>)에 부합하는 과제가 없습니다.
            </div>
            <p style="font-size: 0.8rem; margin-bottom: 1rem;">필터를 초기화하거나, 이 조직/역할로 신규 AI 과제를 등록해보세요.</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-outline btn-sm" id="btnEmptyResetUserFilter">전체 과제 보기 (필터 해제)</button>
              <button class="btn btn-primary btn-sm" id="btnEmptyCreateCase">+ 새 과제 등록하기</button>
            </div>
          </td>
        </tr>
      `;
      const btnReset = document.getElementById("btnEmptyResetUserFilter");
      if (btnReset) btnReset.addEventListener("click", () => setOrgAndRole("all", "all"));
      const btnEmpty = document.getElementById("btnEmptyCreateCase");
      if (btnEmpty) {
        btnEmpty.addEventListener("click", () => {
          populateModalTemplates();
          if (state.currentOrg !== "all") el.newCaseOrg.value = orgObj.name;
          el.newCaseOwner.value = roleObj.name;
          el.modalNewCase.classList.add("active");
        });
      }
      return;
    }

    el.portfolioTableBody.innerHTML = filteredCases.map(c => `
      <tr class="${c.id === state.currentCaseId ? "selected" : ""}">
        <td style="font-family: monospace; font-weight: 700; color: #38bdf8;">${c.id}</td>
        <td><strong style="color: #fff; cursor: pointer;" class="case-title-link" data-id="${c.id}">${c.title}</strong></td>
        <td>${c.org}</td>
        <td><span class="badge badge-purple" style="font-size: 0.72rem;">${c.roleTitle || c.owner}</span></td>
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
        loadCaseIntoWorkspace(link.getAttribute("data-id"));
        switchTab("tab-roi");
      });
    });

    document.querySelectorAll(".btn-case-sim").forEach(btn => {
      btn.addEventListener("click", () => {
        loadCaseIntoWorkspace(btn.getAttribute("data-id"));
        switchTab("tab-roi");
      });
    });
  }

  function renderPortfolioKanban() {
    const filteredCases = getFilteredUseCases();
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
      const casesInStage = filteredCases.filter(c => c.stage === st.id);
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
            ${casesInStage.length === 0 ? `
              <div style="text-align: center; padding: 1.5rem 0.5rem; color: var(--text-dim); font-size: 0.72rem; border: 1px dashed rgba(255,255,255,0.06); border-radius: 6px;">
                과제 없음
              </div>
            ` : casesInStage.map(c => `
              <div class="kanban-card ${c.id === state.currentCaseId ? "selected" : ""}" data-id="${c.id}">
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
        loadCaseIntoWorkspace(card.getAttribute("data-id"));
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
    if (state.currentOrg !== "all") el.newCaseOrg.value = getOrgObj(state.currentOrg).name;
    if (state.currentRole !== "all") el.newCaseOwner.value = getRoleObj(state.currentRole).name;
    el.modalNewCase.classList.add("active");
  });
  el.btnQuickCreateUseCase.addEventListener("click", () => {
    populateModalTemplates();
    if (state.currentOrg !== "all") el.newCaseOrg.value = getOrgObj(state.currentOrg).name;
    if (state.currentRole !== "all") el.newCaseOwner.value = getRoleObj(state.currentRole).name;
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

    addAuditLog("USE_CASE_REGISTERED", newId, `신규 과제 등록: ${title} (소유자: ${owner})`);
    el.modalNewCase.classList.remove("active");
    el.newCaseTitle.value = "";
    el.newCaseDesc.value = "";

    populateCaseDropdowns();
    setOrgAndRole(newCase.catId || "all", newCase.role || "owner");
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

    // 2. Scenario Multipliers (5 Strategic Scenarios)
    let costMult = 1.0;
    let benefitMult = 1.0;
    if (state.scenario === "conservative") {
      costMult = 1.20;
      benefitMult = 0.75;
    } else if (state.scenario === "aggressive") {
      costMult = 0.88;
      benefitMult = 1.30;
    } else if (state.scenario === "regulatory") {
      costMult = 1.35;
      benefitMult = 0.85;
    } else if (state.scenario === "early_harvest") {
      costMult = 0.95;
      benefitMult = 1.15;
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
        id: "conservative",
        name: "보수적 (Conservative)",
        desc: "리스크 방어, 비용 +20%, 편익 -25%",
        tco: baseRes.threeYearTco * 1.20,
        ben: baseRes.threeYearGrossBenefit * 0.75,
        roi: baseRes.roi3Y * 0.62,
        pb: "6.8개월",
        purpose: "안전마진 및 하방 리스크 심의"
      },
      {
        id: "aggressive",
        name: "공격적 (Aggressive)",
        desc: "전사 확산 가속, 비용 -12%, 편익 +30%",
        tco: baseRes.threeYearTco * 0.88,
        ben: baseRes.threeYearGrossBenefit * 1.30,
        roi: baseRes.roi3Y * 1.48,
        pb: "2.8개월",
        purpose: "최대 상한 포텐셜 및 가치 극대화"
      },
      {
        id: "regulatory",
        name: "규제·보안 강화 (Regulatory)",
        desc: "GxP/보안 검증 공수 반영, 비용 +35%, 위험 0화",
        tco: baseRes.threeYearTco * 1.35,
        ben: baseRes.threeYearGrossBenefit * 0.85,
        roi: baseRes.roi3Y * 0.63,
        pb: "7.9개월",
        purpose: "컴플라이언스 준수 및 엄격 통제"
      },
      {
        id: "early_harvest",
        name: "조기 가치회수 (Quick-Win)",
        desc: "초기 1년 집중 채택 및 빠른 가치 실현",
        tco: baseRes.threeYearTco * 0.95,
        ben: baseRes.threeYearGrossBenefit * 1.15,
        roi: baseRes.roi3Y * 1.21,
        pb: "3.2개월",
        purpose: "단기 승리 확보 및 전사 확산 마중물"
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

  // Export Memo & Audit Trail Handlers
  if (el.btnExportMemo) {
    el.btnExportMemo.addEventListener("click", () => {
      switchTab("tab-reports");
      addAuditLog("INVESTMENT_MEMO_EXPORTED", state.currentCaseId, "경영진 투자 심의 메모 출력 및 보고서 생성");
    });
  }

  if (el.btnExportAudit) {
    el.btnExportAudit.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.auditLogs, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `AX_Governance_AuditTrail_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addAuditLog("AUDIT_TRAIL_DOWNLOADED", "SYSTEM", "전사 거버넌스 감사 증적 JSON 파일 내보내기");
      alert("감사 로그 덤프 파일이 다운로드되었습니다.");
    });
  }

  function addAuditLog(action, obj, desc) {
    const orgObj = getOrgObj(state.currentOrg);
    const roleObj = getRoleObj(state.currentRole);
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ` +
                    `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

    state.auditLogs.unshift({
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      time: timeStr,
      actor: `${roleObj.name} (${orgObj.shortName})`,
      role: roleObj.label,
      action: action,
      obj: obj,
      desc: desc
    });

    if (state.activeTab === "tab-governance") renderAuditLogs();
  }

  // --- Module 8: Executive Report ---
  function renderExecutiveReport() {
    const filteredCases = getFilteredUseCases();
    const orgObj = getOrgObj(state.currentOrg);
    const roleObj = getRoleObj(state.currentRole);

    if (el.reportScopeBadge) {
      el.reportScopeBadge.textContent = (state.currentOrg === "all" && state.currentRole === "all")
        ? `전사 26대 핵심 과제 종합 심의 보고` 
        : `${orgObj.name} · ${roleObj.name} 관점 (${filteredCases.length}건)`;
    }

    if (filteredCases.length === 0) {
      el.reportSummaryTable.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
            선택된 조건 (${orgObj.name} · ${roleObj.name})에 부합하는 과제가 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    el.reportSummaryTable.innerHTML = filteredCases.map(c => `
      <tr>
        <td><strong>${c.title}</strong></td>
        <td>${c.org} (${c.roleTitle || c.owner})</td>
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
    populateCaseDropdowns();
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
  populateCaseDropdowns();
  loadCaseIntoWorkspace(state.currentCaseId, false);
  renderCatalog();
  setOrgAndRole("all", "all");
});

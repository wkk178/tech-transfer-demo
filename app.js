// ================= 定义状态流转节点 =================
// 满足需求：状态从“需求发布” -> “匹配中” -> “对接中” -> “转化中”逐步变化
const STATUS_FLOW = [
    { name: "需求发布", color: "bg-secondary", showLifeBar: false },
    { name: "匹配中", color: "bg-info", showLifeBar: false },
    { name: "对接中", color: "bg-primary", showLifeBar: false },
    { name: "转化中(中试死亡谷)", color: "bg-warning text-dark", showLifeBar: true },
    { name: "产业化落地", color: "bg-success", showLifeBar: false }
];

// ================= 从实际数据源加载的数据 =================
const actualData = {
    matchedDemands: [
        { name: "航空铝材残余应力控制技术", field: "先进制造", target: "某材料研究院", investment: "500万", clusterTag: "【技术攻坚型·材料】" },
        { name: "柔性直流供电关键技术", field: "能源电力", target: "某电网央企", investment: "面议", clusterTag: "【技术攻坚型·能源】" },
        { name: "6G通信低延迟算法优化", field: "数字通信", target: "某通信央企", investment: "200万", clusterTag: "【市场接轨型·通信】" }
    ],
    recommendedAchievements: [
        { name: "纳秒级暂态精细化仿真算法", level: "国际领先", source: "某重点高校", ipr: "发明专利12项", clusterTag: "【基础研究型·高校】" },
        { name: "切缝翘曲法应力测试一体机", level: "首台套", source: "某顶尖高校", ipr: "PCT国际专利", clusterTag: "【产业应用型·装备】" },
        { name: "高并发边缘计算中间件", level: "实验室验证", source: "某部属高校", ipr: "软著5项", clusterTag: "【概念验证型·软件】" }
    ],
    // 初始状态索引 (currentStep) 对应 STATUS_FLOW
    projects: [
        { name: "柔性直流仿真验证", supplier: "某重点高校", demander: "某电网央企", currentStep: 3, survivalRate: 20 },
        { name: "航空材料联合实验室", supplier: "某顶尖高校", demander: "某材料研究院", currentStep: 4, survivalRate: 100 },
        { name: "6G算法验证项目", supplier: "某部属高校", demander: "某通信央企", currentStep: 1, survivalRate: 100 }
    ]
};

// ================= 初始化 =================
document.addEventListener('DOMContentLoaded', () => {
    renderDemands();
    renderAchievements();
    renderProjects();
});

// ================= 渲染函数 =================

// 1. 渲染央企需求列表
function renderDemands() {
    const list = document.getElementById('uni-demand-list');
    list.innerHTML = '';
    actualData.matchedDemands.forEach((d, index) => {
        list.innerHTML += `
        <li class="list-group-item p-3 border-bottom searchable-item fade-in">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0 fw-bold search-target">${d.name}</h6>
                <span class="badge bg-light text-dark border">${d.field}</span>
            </div>
            <div class="mb-2 text-primary small fw-bold">${d.clusterTag}</div>
            <div class="d-flex justify-content-between align-items-end mt-2">
                <small class="text-muted"><i class="bi bi-building"></i> ${d.target} &nbsp;|&nbsp; 拟投入: <span class="text-danger">${d.investment}</span></small>
                <div>
                    <!-- AI 智能匹配演示按钮 -->
                    <button class="btn btn-sm btn-primary me-1" onclick="showAIMatch('${d.name}')"><i class="bi bi-cpu"></i> AI匹配</button>
                    <button class="btn btn-sm btn-outline-success" onclick="showToast('发起意向成功，等待技术经理人介入！')">发起意向</button>
                </div>
            </div>
        </li>`;
    });
}

// 2. 渲染高校成果列表
function renderAchievements() {
    const list = document.getElementById('soe-result-list');
    list.innerHTML = '';
    actualData.recommendedAchievements.forEach(r => {
        let badgeColor = r.level.includes("领先") ? "bg-danger" : (r.level.includes("首台") ? "bg-warning text-dark" : "bg-primary");
        list.innerHTML += `
        <li class="list-group-item p-3 border-bottom searchable-item fade-in">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0 fw-bold search-target">${r.name}</h6>
                <span class="badge ${badgeColor}">${r.level}</span>
            </div>
            <div class="mb-2 text-success small fw-bold">${r.clusterTag}</div>
            <div class="d-flex justify-content-between align-items-end mt-2">
                <small class="text-muted"><i class="bi bi-mortarboard"></i> ${r.source} &nbsp;|&nbsp; ${r.ipr}</small>
                <button class="btn btn-sm btn-outline-primary" onclick="showToast('已请求技术对接，管委会即将评估资金流！')">技术对接</button>
            </div>
        </li>`;
    });
}

// 3. 渲染管委会项目进度表
function renderProjects() {
    const govTable = document.getElementById('gov-table-body');
    govTable.innerHTML = '';
    
    actualData.projects.forEach((p, index) => {
        let stepInfo = STATUS_FLOW[p.currentStep];
        let phaseBadge = `<span class='badge ${stepInfo.color} fs-6'>${stepInfo.name}</span>`;
        
        let lifeBarHtml = "";
        let actionButtons = `<button class="btn btn-sm btn-outline-dark mb-1 w-100" onclick="advanceStatus(${index})"><i class="bi bi-arrow-right-circle"></i> 推进下一阶段</button>`;

        // 如果处于“中试死亡谷”阶段，渲染预警条和一键激活按钮
        if(stepInfo.showLifeBar) {
            lifeBarHtml = `
                <div class="mt-3">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-danger fw-bold"><i class="bi bi-exclamation-triangle-fill"></i> 中试死亡谷时效预警</small>
                        <small class="text-danger fw-bold">${p.survivalRate}%</small>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width: ${p.survivalRate}%"></div>
                    </div>
                </div>`;
            actionButtons += `
                <button class="btn btn-sm btn-danger mt-2 w-100 fw-bold shadow-sm" onclick="showToast('✅ 绿色通道已激活！中试风险补偿基金即将拨付。')">
                    <i class="bi bi-lightning-charge-fill"></i> 激活风险补偿基金
                </button>`;
        }

        govTable.innerHTML += `
        <tr class="fade-in">
            <td class="ps-4 fw-bold text-wrap" style="min-width: 180px;">
                ${p.name}
                ${lifeBarHtml}
            </td>
            <td class="text-nowrap"><span class="text-muted"><i class="bi bi-mortarboard"></i> ${p.supplier}</span></td>
            <td class="text-nowrap"><span class="text-muted"><i class="bi bi-building"></i> ${p.demander}</span></td>
            <td class="text-nowrap">${phaseBadge}</td>
            <td class="text-nowrap" style="min-width: 180px;">${actionButtons}</td>
        </tr>`;
    });
}


// ================= 新增三大交互功能 =================

// 功能 1：需求/成果发布模拟 (高校发布成果)
function publishAchievement() {
    const title = document.getElementById('uni-form-title').value;
    const level = document.getElementById('uni-form-level').value;
    const tag = document.getElementById('uni-form-tag').value;

    if(!title) return showToast("⚠️ 请填写成果名称！");

    // 将新数据插入到数组最前面 (unshift)
    actualData.recommendedAchievements.unshift({
        name: title,
        level: level,
        source: "当前入驻高校",
        ipr: "待评估",
        clusterTag: tag || "【新增发布成果】"
    });

    renderAchievements(); // 重新渲染列表
    showToast(`🎉 成果 [${title}] 发布成功，已置顶！`);
    
    // 清空表单
    document.getElementById('uni-form-title').value = '';
    document.getElementById('uni-form-tag').value = '';
}

// 功能 1补充：央企发布需求
function publishDemand() {
    const title = document.getElementById('soe-form-title').value;
    const budget = document.getElementById('soe-form-budget').value;
    const tag = document.getElementById('soe-form-tag').value;

    if(!title) return showToast(" 请填写需求命题！");

    actualData.matchedDemands.unshift({
        name: title,
        field: "新增领域",
        target: "当前入驻央企",
        investment: budget || "面议",
        clusterTag: tag || "【新增发布需求】"
    });

    renderDemands();
    showToast(`🎉 需求 [${title}] 发布成功，已置顶！`);
    
    document.getElementById('soe-form-title').value = '';
    document.getElementById('soe-form-budget').value = '';
    document.getElementById('soe-form-tag').value = '';
}

// 功能 2：智能匹配演示 (AI 匹配分析)
function showAIMatch(demandName) {
    document.getElementById('ai-target-demand').innerText = demandName;
    const resultBox = document.getElementById('ai-match-results');
    
    // 模拟 AI 生成的匹配数据
    const mockTop3 = [
        { name: "纳秒级暂态精细化仿真算法", uni: "清华大学", score: 92, reason: "核心技术参数 100% 覆盖，团队具备军工级验证经验。" },
        { name: "高频电磁场自适应抑制模型", uni: "北京航空航天大学", score: 85, reason: "应用场景高度重合，但目前处于实验室阶段，需中试。" },
        { name: "宽频带复合屏蔽材料", uni: "北京科技大学", score: 78, reason: "材料属性符合，成本预算较低，可作为备选降本方案。" }
    ];

    resultBox.innerHTML = '';
    mockTop3.forEach((item, idx) => {
        let badgeStyle = idx === 0 ? 'bg-danger' : 'bg-secondary';
        resultBox.innerHTML += `
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h6 class="fw-bold"><span class="badge ${badgeStyle} me-2">TOP ${idx+1}</span>${item.name}</h6>
                        <h5 class="text-success fw-bold">${item.score}%</h5>
                    </div>
                    <div class="text-muted small mt-2"><i class="bi bi-bank"></i> 来源：${item.uni}</div>
                    <div class="text-dark small mt-2 bg-light p-2 rounded border border-light">
                        <strong>💡 AI 匹配理由：</strong>${item.reason}
                    </div>
                </div>
            </div>
        </div>`;
    });

    // 调出 Bootstrap 弹窗
    const modal = new bootstrap.Modal(document.getElementById('aiMatchModal'));
    modal.show();
}

// 功能 3：状态流转演示
function advanceStatus(projectIndex) {
    let project = actualData.projects[projectIndex];
    
    // 如果还没到最后一步，就推进状态
    if (project.currentStep < STATUS_FLOW.length - 1) {
        project.currentStep++;
        
        // 重置生存率（如果是退出了中试阶段）
        if(project.currentStep === 4) project.survivalRate = 100;
        
        renderProjects();
        showToast(`项目状态已更新为：${STATUS_FLOW[project.currentStep].name}`);
    } else {
        showToast(` 该项目已完成产业化落地，流转结束！`);
    }
}

// ================= 其他复用函数 =================
function switchView(viewId, element) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
    document.getElementById('view-' + viewId).classList.remove('d-none');
    document.querySelectorAll('.sidebar .nav-link').forEach(el => {
        el.classList.remove('active'); el.classList.add('text-white');
    });
    element.classList.add('active'); element.classList.remove('text-white');
}

function filterList(inputElement, listId) {
    const filter = inputElement.value.toLowerCase();
    const items = document.getElementById(listId).getElementsByClassName('searchable-item');
    for (let i = 0; i < items.length; i++) {
        let textValue = items[i].querySelector('.search-target').innerText;
        items[i].classList.toggle('d-none-search', textValue.toLowerCase().indexOf(filter) === -1);
    }
}

function showToast(message) {
    document.getElementById('toastMessage').innerText = message;
    new bootstrap.Toast(document.getElementById('liveToast'), { delay: 3000 }).show();
}
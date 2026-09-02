// 状态流转节点 
const STATUS_FLOW = [
    { name: "意向对接中", color: "bg-secondary", showLifeBar: false },
    { name: "智能匹配与概念验证", color: "bg-info", showLifeBar: false },
    { name: "中试孵化(死亡谷期)", color: "bg-warning text-dark", showLifeBar: true },
    { name: "基金注资与熟化", color: "bg-primary", showLifeBar: false },
    { name: "产业化落地", color: "bg-success", showLifeBar: false }
];

const actualData = {
    matchedDemands: [
        { name: "航空铝材残余应力控制技术", field: "先进制造", target: "某材料研究院", investment: "500万", clusterTag: "【重点攻坚·材料】" },
        { name: "柔性直流供电关键技术", field: "能源电力", target: "某电网央企", investment: "面议", clusterTag: "【重点攻坚·能源】" },
        { name: "6G通信低延迟算法优化", field: "数字通信", target: "某通信央企", investment: "200万", clusterTag: "【市场接轨·通信】" }
    ],
    recommendedAchievements: [
        { name: "纳秒级暂态精细化仿真算法", level: "国际领先", source: "某重点高校", ipr: "发明专利12项", clusterTag: "【基础研究·软件】" },
        { name: "切缝翘曲法应力测试一体机", level: "首台套", source: "某顶尖高校", ipr: "PCT国际专利", clusterTag: "【产业应用·装备】" },
        { name: "高并发边缘计算中间件", level: "概念验证阶段", source: "某部属高校", ipr: "软著5项", clusterTag: "【概念验证·信创】" }
    ],
    projects: [
        { name: "柔性直流仿真验证平台孵化", supplier: "某重点高校", demander: "某电网央企", currentStep: 2, survivalRate: 15, updateTime: "2小时前" },
        { name: "航空材料联合实验室建立", supplier: "某顶尖高校", demander: "某材料研究院", currentStep: 4, survivalRate: 100, updateTime: "昨天" },
        { name: "6G算法核心逻辑验证", supplier: "某部属高校", demander: "某通信央企", currentStep: 0, survivalRate: 100, updateTime: "刚才" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    renderDemands();
    renderAchievements();
    renderProjects();
    initChart();       
    startLiveFeed();   
});


function renderDemands() {
    const list = document.getElementById('uni-demand-list');
    list.innerHTML = '';
    actualData.matchedDemands.forEach(d => {
        list.innerHTML += `
        <li class="list-group-item p-3 border-bottom searchable-item fade-in">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0 fw-bold search-target">${d.name}</h6>
                <span class="badge bg-light text-dark border">${d.field}</span>
            </div>
            <div class="mb-2 text-primary small fw-bold"><i class="bi bi-tag-fill"></i> ${d.clusterTag}</div>
            <div class="d-flex justify-content-between align-items-end mt-2">
                <small class="text-muted"><i class="bi bi-building"></i> ${d.target} &nbsp;|&nbsp; 拟孵化投入: <span class="text-danger">${d.investment}</span></small>
                <div>
                    <button class="btn btn-sm btn-primary me-1 shadow-sm" onclick="showAIMatch('${d.name}')"><i class="bi bi-cpu"></i> 智能测算</button>
                    <button class="btn btn-sm btn-outline-success" onclick="showToast('已申请进入该项目的孵化库！')">参与孵化</button>
                </div>
            </div>
        </li>`;
    });
}

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
            <div class="mb-2 text-success small fw-bold"><i class="bi bi-tag-fill"></i> ${r.clusterTag}</div>
            <div class="d-flex justify-content-between align-items-end mt-2">
                <small class="text-muted"><i class="bi bi-mortarboard"></i> ${r.source} &nbsp;|&nbsp; ${r.ipr}</small>
                <button class="btn btn-sm btn-outline-primary" onclick="showToast('已向技术经理人发起项目尽调请求！')">申请尽调</button>
            </div>
        </li>`;
    });
}

function renderProjects() {
    const govTable = document.getElementById('gov-table-body');
    govTable.innerHTML = '';
    actualData.projects.forEach((p, index) => {
        let stepInfo = STATUS_FLOW[p.currentStep];
        let phaseBadge = `<span class='badge ${stepInfo.color} fs-6'>${stepInfo.name}</span>`;
        let lifeBarHtml = "";
        let actionButtons = `<button class="btn btn-sm btn-outline-dark mb-1 w-100" onclick="advanceStatus(${index})"><i class="bi bi-fast-forward-circle"></i> 推进流转</button>`;

        if(stepInfo.showLifeBar) {
            lifeBarHtml = `
                <div class="mt-3">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-danger fw-bold"><i class="bi bi-heart-pulse-fill"></i> 死亡谷预警</small>
                        <small class="text-danger fw-bold">${p.survivalRate}%</small>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width: ${p.survivalRate}%"></div>
                    </div>
                </div>`;
            actionButtons += `<button class="btn btn-sm btn-danger mt-2 w-100 fw-bold shadow-sm" onclick="showToast('✅ 审批通过，基金开始拨付。')"><i class="bi bi-lightning-charge-fill"></i> 激活基金</button>`;
        }

        govTable.innerHTML += `
        <tr class="fade-in">
            <td class="ps-4 fw-bold text-wrap" style="min-width: 220px;">${p.name}${lifeBarHtml}</td>
            <td class="text-nowrap"><span class="text-muted"><i class="bi bi-mortarboard"></i> ${p.supplier}</span></td>
            <td class="text-nowrap"><span class="text-muted"><i class="bi bi-building"></i> ${p.demander}</span></td>
            <td class="text-nowrap"><div>${phaseBadge}</div><div class="small text-muted mt-2"><i class="bi bi-clock-history"></i> 更新于 ${p.updateTime}</div></td>
            <td class="text-nowrap" style="min-width: 150px;">${actionButtons}</td>
        </tr>`;
    });
}


function showAIMatch(demandName) {
    document.getElementById('ai-target-demand').innerText = demandName;
    const resultBox = document.getElementById('ai-match-results');
    const container = document.getElementById('ai-match-container');
    const loader = document.getElementById('ai-loading');
    
    new bootstrap.Modal(document.getElementById('aiMatchModal')).show();
    container.classList.add('d-none');
    loader.classList.remove('d-none');
    const kgBox = document.getElementById('kg-container');
    if (kgBox) { kgBox.classList.add('d-none'); }

    setTimeout(() => {
        // 调用真实 NLP + 知识图谱引擎实时计算匹配结果（不再是预设数据）
        const result = (typeof Matching !== 'undefined') ? Matching.computeMatch(demandName) : { top: [] };
        window.__lastMatch = result;
        const dynamicData = result.top || [];

        resultBox.innerHTML = '';
        dynamicData.forEach((item, idx) => {
            let badgeStyle = idx === 0 ? 'bg-danger' : (idx === 1 ? 'bg-warning text-dark' : 'bg-primary');
            resultBox.innerHTML += `
            <div class="col-12">
                <div class="card border-0 shadow-sm border-start border-4 border-primary">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h6 class="fw-bold"><span class="badge ${badgeStyle} me-2">TOP ${idx+1}</span>${item.name}</h6>
                            <h5 class="text-success fw-bold">${item.score}%</h5>
                        </div>
                        <!-- 新增匹配度进度条 -->
                        <div class="progress mt-1 mb-2" style="height: 4px;">
                            <div class="progress-bar bg-success" style="width: ${item.score}%"></div>
                        </div>
                        <div class="text-muted small"><i class="bi bi-bank"></i> 技术供给方：${item.uni}</div>
                        <div class="text-dark small mt-2 bg-light p-2 rounded border border-light">
                            <strong><i class="bi bi-lightbulb text-warning"></i> AI 分析：</strong>${item.reason}
                        </div>
                    </div>
                </div>
            </div>`;
        });

        loader.classList.add('d-none');
        container.classList.remove('d-none');
    }, 1500);
}

// 在匹配弹窗中展示需求—领域—成果—知产 关联知识图谱
function toggleKG() {
    const kgBox = document.getElementById('kg-container');
    if (!kgBox) return;
    if (!window.__lastMatch) { showToast('请先执行一次智能测算'); return; }
    kgBox.classList.remove('d-none');
    Matching.renderKG(kgBox, window.__lastMatch.requirement, window.__lastMatch.top);
}


function publishAchievement() {
    const title = document.getElementById('uni-form-title').value;
    const level = document.getElementById('uni-form-level').value;
    const btn = document.getElementById('btn-pub-uni');
    if(!title) return showToast(" 请填写成果名称！");
    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> AI智能提取打标中...`;
    btn.disabled = true;
    setTimeout(() => {
        let aiTag = "【综合类·成果】";
        if (title.includes("算法") || title.includes("模型")) aiTag = "【数字通信·软成果】";
        if (title.includes("材料") || title.includes("电池")) aiTag = "【先进制造·新材料】";
        // 同步写入知识图谱，使新成果立即参与后续智能匹配
        if (typeof Matching !== 'undefined') {
            Matching.registerAchievement({
                name: title,
                field: Matching.guessField(title),
                keywords: Matching.tokenize(title),
                maturity: level,
                ip: '评估中',
                source: '当前入驻高校'
            });
        }
        actualData.recommendedAchievements.unshift({ name: title, level: level, source: "当前入驻高校", ipr: "评估中", clusterTag: aiTag });
        renderAchievements();
        showToast(`🎉 发布成功！大模型已自动打标为 ${aiTag}`);
        btn.innerHTML = `提交发布`; btn.disabled = false;
        document.getElementById('uni-form-title').value = '';
    }, 1200);
}

function publishDemand() {
    const title = document.getElementById('soe-form-title').value;
    const budget = document.getElementById('soe-form-budget').value;
    const btn = document.getElementById('btn-pub-soe');
    if(!title) return showToast(" 请填写需求命题！");
    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> AI解构痛点中...`;
    btn.disabled = true;
    setTimeout(() => {
        let aiTag = "【产业需求·综合】";
        if (title.includes("电池") || title.includes("电")) aiTag = "【能源电力·重点攻坚】";
        // 同步写入知识图谱，使本需求立即可被检索与匹配
        if (typeof Matching !== 'undefined') {
            Matching.registerDemand({
                name: title,
                field: Matching.guessField(title),
                enterprise: '当前入驻央企',
                budget: budget || '面议',
                keywords: Matching.tokenize(title),
                stage: '意向对接中',
                tags: [aiTag]
            });
        }
        actualData.matchedDemands.unshift({ name: title, field: "AI解析领域", target: "当前入驻央企", investment: budget || "面议", clusterTag: aiTag });
        renderDemands();
        showToast(` 需求发布成功！AI已解析核心痛点，正在全网寻源。`);
        btn.innerHTML = `智能发布并全网寻源`; btn.disabled = false;
        document.getElementById('soe-form-title').value = '';
    }, 1200);
}

function advanceStatus(projectIndex) {
    let project = actualData.projects[projectIndex];
    if (project.currentStep < STATUS_FLOW.length - 1) {
        project.currentStep++;
        project.updateTime = "刚刚";
        if(project.currentStep === 4) project.survivalRate = 100;
        renderProjects();
        showToast(`孵化阶段已推进至：${STATUS_FLOW[project.currentStep].name}`);
    } else {
        showToast(` 该项目已完成产业化落地！`);
    }
}


function initChart() {
    var chartDom = document.getElementById('industryChart');
    if(chartDom) {
        var myChart = echarts.init(chartDom);
        var option = {
            tooltip: { trigger: 'item' },
            legend: { bottom: '0%', left: 'center' },
            color: ['#0d6efd', '#198754', '#ffc107', '#0dcaf0', '#dc3545'],
            series: [{
                name: '产业领域', type: 'pie', radius: ['40%', '70%'], center: ['50%', '45%'],
                itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                data: [
                    { value: 45, name: '能源电力' },
                    { value: 35, name: '航空航天' },
                    { value: 30, name: '数字通信' },
                    { value: 25, name: '先进制造' },
                    { value: 15, name: '生物医药' }
                ]
            }]
        };
        myChart.setOption(option);
        
        window.addEventListener('resize', function() { myChart.resize(); });
    }
}


function startLiveFeed() {
    const feedList = document.getElementById('live-feed-list');
    const messages = [
        "【管委会】为某重点高校下拨了中试风险基金",
        "【技术经理人】成功撮合“新一代储能”项目对接",
        "【某通信央企】发布了关于 6G 算法的最新产业需求",
        "【某顶尖高校】提交了3项“首台套”级别专利库",
        "【AI系统】自动为新入库材料成果打标并推送"
    ];
    
   
    for(let i=0; i<3; i++) { addFeedItem(feedList, messages[Math.floor(Math.random() * messages.length)]); }

    // 每隔 4 秒随机插入一条新动态
    setInterval(() => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        addFeedItem(feedList, randomMsg);
    }, 4000);
}

function addFeedItem(listElement, text) {
    const li = document.createElement('li');
    li.className = 'list-group-item px-3 py-2 text-muted small feed-item-enter border-0 border-bottom';
    li.innerHTML = `<i class="bi bi-record-circle text-primary me-2"></i>刚刚：${text}`;
    
    listElement.insertBefore(li, listElement.firstChild);
    
    
    if(listElement.children.length > 5) {
        listElement.removeChild(listElement.lastChild);
    }
}


function switchView(viewId, element) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
    document.getElementById('view-' + viewId).classList.remove('d-none');
    document.querySelectorAll('.sidebar .nav-link').forEach(el => { el.classList.remove('active'); el.classList.add('text-white'); });
    element.classList.add('active'); element.classList.remove('text-white');
  
    if(viewId === 'home') { setTimeout(() => { echarts.getInstanceByDom(document.getElementById('industryChart')).resize(); }, 100); }
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

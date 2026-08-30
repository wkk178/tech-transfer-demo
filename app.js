// ================= 从实际数据源加载的数据 =================
// 数据来源: Code_20260830153859.json[cite: 2]
const actualData = {
    // 高校端：匹配到的央企需求[cite: 2]
    matchedDemands: [
        { name: "航空铝材残余应力控制技术", field: "先进制造", target: "某材料研究院", investment: "500万" },
        { name: "柔性直流供电关键技术", field: "能源电力", target: "某电网央企", investment: "面议" },
        { name: "6G通信低延迟算法优化", field: "数字通信", target: "某通信央企", investment: "200万" },
        { name: "新型航空发动机叶片涂层", field: "航空航天", target: "某航天集团", investment: "1000万" }
    ],
    // 央企端：推荐的高校成果[cite: 2]
    recommendedAchievements: [
        { name: "纳秒级暂态精细化仿真算法", level: "国际领先", source: "某重点高校", ipr: "发明专利12项" },
        { name: "切缝翘曲法应力测试一体机", level: "首台套", source: "某顶尖高校", ipr: "PCT国际专利" },
        { name: "高并发边缘计算中间件", level: "实验室验证", source: "某部属高校", ipr: "软著5项" }
    ],
    // 管委会端：全流程对接监控项目[cite: 2]
    projects: [
        { name: "柔性直流仿真验证", supplier: "某重点高校", demander: "某电网央企", status: "资金流已匹配\n中试阶段" },
        { name: "航空材料联合实验室", supplier: "某顶尖高校", demander: "某材料研究院", status: "政策/知识产权协同\n产业化落地" },
        { name: "6G算法验证项目", supplier: "某部属高校", demander: "某通信央企", status: "人才流配置中\n立项确权" }
    ]
};

// ================= 初始化渲染 =================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 渲染高校端看到的央企需求[cite: 2]
    const demandList = document.getElementById('uni-demand-list');
    actualData.matchedDemands.forEach(d => {
        demandList.innerHTML += `
        <li class="list-group-item p-3 border-bottom searchable-item">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-bold search-target">${d.name}</h6>
                <span class="badge bg-light text-dark border">${d.field}</span>
            </div>
            <div class="d-flex justify-content-between align-items-end mt-2">
                <small class="text-muted"><i class="bi bi-building"></i> ${d.target} &nbsp;|&nbsp; 拟投入: <span class="text-danger">${d.investment}</span></small>
                <button class="btn btn-sm btn-outline-success" onclick="showToast('发起意向成功，等待技术经理人介入！')">发起意向</button>
            </div>
        </li>`;
    });

    // 2. 渲染央企端看到的高校成果[cite: 2]
    const resultList = document.getElementById('soe-result-list');
    actualData.recommendedAchievements.forEach(r => {
        // 根据成熟度级别给不同颜色的标签
        let badgeColor = r.level === "国际领先" ? "bg-danger" : (r.level === "首台套" ? "bg-warning text-dark" : "bg-primary");
        
        resultList.innerHTML += `
        <li class="list-group-item p-3 border-bottom searchable-item">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-bold search-target">${r.name}</h6>
                <span class="badge ${badgeColor}">${r.level}</span>
            </div>
            <div class="d-flex justify-content-between align-items-end mt-2">
                <small class="text-muted"><i class="bi bi-mortarboard"></i> ${r.source} &nbsp;|&nbsp; ${r.ipr}</small>
                <button class="btn btn-sm btn-outline-primary" onclick="showToast('已请求技术对接，管委会即将评估资金流！')">技术对接</button>
            </div>
        </li>`;
    });

    // 3. 渲染管委会端进度表[cite: 2]
    const govTable = document.getElementById('gov-table-body');
    actualData.projects.forEach(p => {
        // 解析数据中的 "\n" 进行分行展示[cite: 2]
        const statusParts = p.status.split('\n');
        const resourceStatus = statusParts[0]; 
        const phaseStatus = statusParts[1] || "";
        
        // 动态匹配阶段颜色
        let phaseBadge = "";
        if(phaseStatus.includes("中试")) phaseBadge = `<span class='badge bg-warning text-dark'>${phaseStatus}</span>`;
        else if(phaseStatus.includes("产业化")) phaseBadge = `<span class='badge bg-success'>${phaseStatus}</span>`;
        else phaseBadge = `<span class='badge bg-primary'>${phaseStatus}</span>`;

        govTable.innerHTML += `
        <tr>
            <td class="ps-4 fw-bold text-wrap" style="min-width: 150px;">${p.name}</td>
            <td class="text-nowrap"><span class="text-muted"><i class="bi bi-mortarboard"></i> ${p.supplier}</span></td>
            <td class="text-nowrap"><span class="text-muted"><i class="bi bi-building"></i> ${p.demander}</span></td>
            <td class="text-nowrap">
                <div class="small text-secondary mb-1">${resourceStatus}</div>
                ${phaseBadge}
            </td>
            <td class="text-nowrap">
                <button class="btn btn-sm btn-light border mb-1" onclick="showToast('已指派技术经理人跟进！')">指派专员</button>
                <button class="btn btn-sm btn-primary mb-1" onclick="showToast('已为该项目匹配风险补偿政策！')">匹配政策</button>
            </td>
        </tr>`;
    });
});

// ================= 视图切换逻辑 =================
function switchView(viewId, element) {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('d-none');
    });
    document.getElementById('view-' + viewId).classList.remove('d-none');
    
    document.querySelectorAll('.sidebar .nav-link').forEach(el => {
        el.classList.remove('active');
        el.classList.add('text-white');
    });
    element.classList.add('active');
    element.classList.remove('text-white');
}

// ================= 搜索过滤功能 =================
function filterList(inputElement, listId) {
    const filter = inputElement.value.toLowerCase();
    const list = document.getElementById(listId);
    const items = list.getElementsByClassName('searchable-item');

    for (let i = 0; i < items.length; i++) {
        let textValue = items[i].querySelector('.search-target').innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            items[i].classList.remove('d-none-search');
        } else {
            items[i].classList.add('d-none-search');
        }
    }
}

// ================= 提示框 (Toast) =================
function showToast(message) {
    const toastBody = document.getElementById('toastMessage');
    toastBody.innerText = message;
    
    const toastElement = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}
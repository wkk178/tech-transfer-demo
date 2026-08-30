// ================= 数据池 =================
const mockDemands = [
    { title: "航空铝材残余应力控制技术", org: "某材料研究院", budget: "500万", tag: "先进制造" },
    { title: "柔性直流供电关键技术", org: "某电网央企", budget: "面议", tag: "能源电力" },
    { title: "6G通信低延迟算法优化", org: "某通信央企", budget: "200万", tag: "数字通信" },
    { title: "新型航空发动机叶片涂层", org: "某航天集团", budget: "1000万", tag: "航空航天" }
];

const mockResults = [
    { title: "纳秒级暂态精细化仿真算法", org: "某重点高校", tag: "国际领先", patent: "发明专利12项" },
    { title: "切缝翘曲法应力测试一体机", org: "某顶尖高校", tag: "首台套", patent: "PCT国际专利" },
    { title: "高并发边缘计算中间件", org: "某部属高校", tag: "实验室验证", patent: "软著5项" }
];

const mockProgress = [
    { project: "柔性直流仿真验证", uni: "某重点高校", soe: "某电网央企", resource: "资金流已匹配", status: "<span class='badge bg-warning text-dark'>中试阶段</span>" },
    { project: "航空材料联合实验室", uni: "某顶尖高校", soe: "某材料研究院", resource: "政策/知识产权协同", status: "<span class='badge bg-success'>产业化落地</span>" },
    { project: "6G算法验证项目", uni: "某部属高校", soe: "某通信央企", resource: "人才流配置中", status: "<span class='badge bg-primary'>立项确权</span>" }
];

// ================= 初始化渲染 =================
document.addEventListener('DOMContentLoaded', () => {
    // 渲染高校端看到的央企需求
    const demandList = document.getElementById('uni-demand-list');
    mockDemands.forEach(d => {
        demandList.innerHTML += `<li class="list-group-item p-3 border-bottom searchable-item">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-bold search-target">${d.title}</h6>
                <span class="badge bg-light text-dark border">${d.tag}</span>
            </div>
            <div class="d-flex justify-content-between align-items-end">
                <small class="text-muted"><i class="bi bi-building"></i> ${d.org} &nbsp;|&nbsp; 拟投入: <span class="text-danger">${d.budget}</span></small>
                <button class="btn btn-sm btn-outline-success" onclick="showToast('已向央企发送对接意向，等待技术经理人介入！')">发起意向</button>
            </div>
        </li>`;
    });

    // 渲染央企端看到的高校成果
    const resultList = document.getElementById('soe-result-list');
    mockResults.forEach(r => {
        resultList.innerHTML += `<li class="list-group-item p-3 border-bottom searchable-item">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-bold search-target">${r.title}</h6>
                <span class="badge bg-danger">${r.tag}</span>
            </div>
            <div class="d-flex justify-content-between align-items-end">
                <small class="text-muted"><i class="bi bi-mortarboard"></i> ${r.org} &nbsp;|&nbsp; ${r.patent}</small>
                <button class="btn btn-sm btn-outline-primary" onclick="showToast('已请求查看详情，管委会即将对接平台资金！')">技术对接</button>
            </div>
        </li>`;
    });

    // 渲染管委会端进度表
    const govTable = document.getElementById('gov-table-body');
    mockProgress.forEach(p => {
        govTable.innerHTML += `<tr>
            <td class="ps-4 fw-bold">${p.project}</td>
            <td><span class="text-muted"><i class="bi bi-mortarboard"></i> ${p.uni}</span></td>
            <td><span class="text-muted"><i class="bi bi-building"></i> ${p.soe}</span></td>
            <td>${p.resource}</td>
            <td>${p.status}</td>
            <td>
                <button class="btn btn-sm btn-light border" onclick="showToast('已分配技术经理人跟进！')">指派专员</button>
                <button class="btn btn-sm btn-primary" onclick="showToast('已为该项目匹配风险补偿基金！')">匹配政策</button>
            </td>
        </tr>`;
    });
});

// ================= 视图切换逻辑 =================
function switchView(viewId, element) {
    // 隐藏所有面板
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('d-none');
    });
    // 显示目标面板
    document.getElementById('view-' + viewId).classList.remove('d-none');
    
    // 更新侧边栏选中状态
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

// ================= 优美的提示框 (Toast) =================
function showToast(message) {
    const toastBody = document.getElementById('toastMessage');
    toastBody.innerText = message;
    
    const toastElement = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}
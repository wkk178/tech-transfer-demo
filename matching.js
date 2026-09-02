
(function (global) {
  'use strict';

  const TOKEN_DICT = new Set([
    '航空', '铝材', '铝合金', '形变热处理', '残余应力', '应力', '控制', '检测', '材料', '轻量化',
    '制造', '先进制造', '轻合金', '精密成型', '铸造', '成型', '工艺', '超声', '无损', '质检', '装备', '一体机', '首台套', '应力测试',
    '柔性直流', '直流', '供电', '电力电子', '仿真', '暂态', '电磁暂态', '抑制', '装置', '硬件', '电网', '多端', '协同', '模块', '能源电力', '半实物仿真',
    '6g', '通信', '低延迟', '延迟', '算法', '边缘计算', '中间件', '高并发', '信创', '数字通信', '大模型', '多模态', '模型', '底座', '算力',
    '卫星', '路由', '低轨', '发动机', '叶片', '涂层', '热障', '高温', '耐蚀', '合金', '复合材料', '结构', '碳纤维', '航空航天',
    '电池', '储能', '缺陷', '机器学习', '深度学习', '数字孪生', '工业软件', '半导体', '芯片', '新材料', '氢能', '风电', '光伏', '机器人', '传感器', '物联网', '区块链', '云计算', '网络安全', '专利', '软著'
  ]);

  const isCJK = (ch) => /[\u4e00-\u9fa5]/.test(ch);


  function tokenize(text) {
    const s = (text || '').toLowerCase();
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      let matched = false;
      for (let len = Math.min(6, s.length - i); len >= 2; len--) {
        const sub = s.slice(i, i + len);
        if (TOKEN_DICT.has(sub)) { tokens.push(sub); i += len; matched = true; break; }
      }
      if (!matched) {
        const a = s[i], b = s[i + 1];
        if (a && b && isCJK(a) && isCJK(b)) tokens.push(a + b);
        else if (a) tokens.push(a);
        i += 1;
      }
    }
    return tokens;
  }

  const KG = {
    domains: ['先进制造', '能源电力', '数字通信', '航空航天'],
    // 需求节点（供给=央企），含领域、关键词、预算、阶段
    requirements: [
      { id: 'r1', name: '航空铝材残余应力控制技术', field: '先进制造', enterprise: '某材料研究院', budget: '500万', keywords: ['航空', '铝材', '残余应力', '控制', '检测', '材料'], stage: '中试孵化', tags: ['重点攻坚·材料'] },
      { id: 'r2', name: '柔性直流供电关键技术', field: '能源电力', enterprise: '某电网央企', budget: '面议', keywords: ['柔性直流', '供电', '直流', '电力电子', '仿真'], stage: '智能匹配与概念验证', tags: ['重点攻坚·能源'] },
      { id: 'r3', name: '6G通信低延迟算法优化', field: '数字通信', enterprise: '某通信央企', budget: '200万', keywords: ['6g', '通信', '低延迟', '算法', '边缘计算'], stage: '意向对接中', tags: ['市场接轨·通信'] },
      { id: 'r4', name: '新型航空发动机叶片涂层', field: '航空航天', enterprise: '某航天集团', budget: '1000万', keywords: ['航空发动机', '叶片', '涂层', '高温', '耐蚀'], stage: '意向对接中', tags: ['重点攻坚·材料'] }
    ],
    // 成果节点（供给=高校），含领域、关键词、成熟度、知识产权、来源
    achievements: [
      { id: 'a1', name: '高强铝合金形变热处理技术', field: '先进制造', keywords: ['铝合金', '形变热处理', '残余应力', '航空', '材料', '轻量化'], maturity: '中试阶段', ip: '发明专利3项', source: '北京科技大学' },
      { id: 'a2', name: '特种轻合金精密成型工艺', field: '先进制造', keywords: ['轻合金', '精密成型', '铸造', '工艺', '材料'], maturity: '概念验证阶段', ip: '发明专利2项', source: '北京航空航天大学' },
      { id: 'a3', name: '航空级材料超声无损检测', field: '先进制造', keywords: ['超声', '无损', '检测', '材料', '质检'], maturity: '具备产业化条件', ip: '发明专利5项', source: '北京理工大学' },
      { id: 'a4', name: '切缝翘曲法应力测试一体机', field: '先进制造', keywords: ['应力测试', '一体机', '首台套', '检测', '装备'], maturity: '具备产业化条件', ip: 'PCT国际专利', source: '某顶尖高校' },
      { id: 'a5', name: '纳秒级暂态精细化仿真算法', field: '能源电力', keywords: ['暂态', '仿真', '电磁暂态', '电力电子', '半实物仿真'], maturity: '概念验证阶段', ip: '发明专利12项', source: '华北电力大学' },
      { id: 'a6', name: '高频电磁暂态抑制装置', field: '能源电力', keywords: ['电磁暂态', '抑制', '装置', '硬件', '电网'], maturity: '中试阶段', ip: 'PCT国际专利', source: '清华大学' },
      { id: 'a7', name: '直流电网多端协同控制模块', field: '能源电力', keywords: ['直流电网', '多端', '协同', '控制', '模块'], maturity: '概念验证阶段', ip: '发明专利8项', source: '北京交通大学' },
      { id: 'a8', name: '柔性直流供电关键控制技术', field: '能源电力', keywords: ['柔性直流', '直流', '供电', '控制', '电力电子'], maturity: '中试阶段', ip: '发明专利6项', source: '某重点高校' },
      { id: 'a9', name: '多模态行业大模型底座', field: '数字通信', keywords: ['大模型', '多模态', '模型', '算法', '底座'], maturity: '概念验证阶段', ip: '软著5项', source: '北京邮电大学' },
      { id: 'a10', name: '边缘计算节点优化方案', field: '数字通信', keywords: ['边缘计算', '低延迟', '算力', '中间件'], maturity: '中试阶段', ip: '发明专利4项', source: '北京交通大学' },
      { id: 'a11', name: '高并发边缘计算中间件', field: '数字通信', keywords: ['边缘计算', '中间件', '高并发', '信创'], maturity: '概念验证阶段', ip: '软著5项', source: '某部属高校' },
      { id: 'a12', name: '低轨卫星协同路由算法', field: '数字通信', keywords: ['卫星', '路由', '协同', '低轨', '通信'], maturity: '概念验证阶段', ip: '发明专利6项', source: '北京航空航天大学' },
      { id: 'a13', name: '新型航空发动机叶片热障涂层', field: '航空航天', keywords: ['航空发动机', '叶片', '涂层', '热障', '高温'], maturity: '中试阶段', ip: '发明专利7项', source: '某顶尖高校' },
      { id: 'a14', name: '高温合金精密铸造叶片', field: '航空航天', keywords: ['高温', '合金', '铸造', '叶片', '航空'], maturity: '具备产业化条件', ip: '发明专利5项', source: '北京科技大学' },
      { id: 'a15', name: '航空复合材料轻量化结构', field: '航空航天', keywords: ['复合材料', '轻量化', '航空', '结构', '碳纤维'], maturity: '概念验证阶段', ip: '发明专利9项', source: '北京航空航天大学' }
    ]
  };

  const RELATED_FIELDS = {
    '先进制造': ['航空航天', '能源电力'],
    '航空航天': ['先进制造'],
    '能源电力': ['先进制造'],
    '数字通信': []
  };

  const MATURITY_RANK = { '概念验证阶段': 0.3, '中试阶段': 0.7, '具备产业化条件': 1.0, '实验室阶段': 0.2 };


  let docs = [];
  let df = {};
  let idf = {};
  let N = 0;

  function docText(node) {
    return [node.name, node.field, (node.keywords || []).join(' '), (node.tags || []).join(' '),
      node.maturity, node.ip, node.source, node.enterprise].filter(Boolean).join(' ');
  }

  function rebuild() {
    docs = KG.achievements.map((a) => tokenize(docText(a)));
    df = {};
    docs.forEach((tokens) => new Set(tokens).forEach((t) => { df[t] = (df[t] || 0) + 1; }));
    N = docs.length || 1;
    idf = {};
    Object.keys(df).forEach((t) => { idf[t] = Math.log((N + 1) / (1 + df[t])) + 1; });
  }
  rebuild();

  function vecOf(tokens) {
    const tf = {};
    tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
    const v = {};
    Object.keys(tf).forEach((t) => { if (idf[t]) v[t] = tf[t] * idf[t]; });
    return v;
  }

  function cosine(a, b) {
    let s = 0, na = 0, nb = 0;
    for (const t in a) s += a[t] * (b[t] || 0);
    for (const t in a) na += a[t] * a[t];
    for (const t in b) nb += b[t] * b[t];
    if (!na || !nb) return 0;
    return s / Math.sqrt(na * nb);
  }

  function overlap(a, b) {
    if (!a || !b || !a.length || !b.length) return 0;
    const sb = new Set(b);
    const c = a.filter((x) => sb.has(x)).length;
    const u = new Set([...a, ...b]).size;
    return u ? c / u : 0;
  }

  function domainMatch(a, r) {
    if (a.field === r.field) return 1;
    if (RELATED_FIELDS[r.field] && RELATED_FIELDS[r.field].includes(a.field)) return 0.5;
    return 0;
  }

  function ipStrength(a) {
    const ip = a.ip || '';
    let s = 0.2;
    const m = ip.match(/(\d+)项/);
    if (m) s += Math.min(parseInt(m[1], 10) / 12, 1) * 0.5;
    if (/PCT|国际/.test(ip)) s += 0.3;
    if (/软著/.test(ip)) s += 0.2;
    return Math.min(1, s);
  }

  function buildReason(a, r, m) {
    const parts = [];
    const overlapped = (a.keywords || []).filter((k) => (r.keywords || []).includes(k));
    if (m.domain >= 0.9) parts.push(`「${a.field}」领域高度吻合`);
    else if (m.domain >= 0.4) parts.push(`「${a.field}」经知识图谱关联与需求协同`);
    if (overlapped.length) parts.push(`关键词「${overlapped.slice(0, 3).join('/')}」命中`);
    if (m.semantic > 0.12) parts.push(`语义相似度 ${(m.semantic * 100).toFixed(0)}%`);
    if (m.maturity >= 0.9) parts.push(`成熟度「${a.maturity}」，可直接对接`);
    else if (m.maturity >= 0.6) parts.push(`处于「${a.maturity}」，需中试平台支撑`);
    if (m.ip >= 0.6) parts.push(`持有${a.ip}，权属清晰`);
    if (!parts.length) parts.push('存在一定技术相关性，建议技术经理人进一步拆解');
    return parts.join('；') + '。';
  }

  // 多维量化评分：领域38% + 语义28% + 关键词14% + 成熟度10% + 知产10%
  function scoreMatch(a, r) {
    const domain = domainMatch(a, r);
    const semantic = cosine(vecOf(tokenize(docText(a))), vecOf(tokenize(docText(r))));
    const tags = overlap(a.keywords, r.keywords);
    const maturity = MATURITY_RANK[a.maturity] || 0.4;
    const ip = ipStrength(a);
    const score = Math.max(0, Math.min(100,
      Math.round(100 * (0.38 * domain + 0.28 * semantic + 0.14 * tags + 0.10 * maturity + 0.10 * ip))));
    return {
      name: a.name, uni: a.source, field: a.field, maturity: a.maturity, ip: a.ip,
      score, reason: buildReason(a, r, { domain, semantic, tags, maturity, ip })
    };
  }


  function buildRequirementFromText(name) {
    return {
      id: 'rq_' + Date.now(), name,
      field: guessField(name), enterprise: '外部需求', budget: '面议',
      keywords: tokenize(name), stage: '意向对接中', tags: ['外部需求']
    };
  }

  function guessField(name) {
    if (/发动机|叶片|涂层|航天|热障|涡轮|飞行器|无人/.test(name)) return '航空航天';
    if (/电池|储|电|电网|柔性|直流|能源|光电|光伏|氢能/.test(name)) return '能源电力';
    if (/材料|制造|检测|装备|工艺|铝|钢|合金|应力|铸造|成型|轻量化|冶金/.test(name)) return '先进制造';
    if (/通信|6g|5g|网络|算法|数据|信创|算力|信息|大模型/.test(name)) return '数字通信';
    return '综合';
  }

  function resolveRequirement(req) {
    if (typeof req === 'string') {
      return KG.requirements.find((x) => x.name === req) || buildRequirementFromText(req);
    }
    return req;
  }

  function computeMatch(req) {
    const r = resolveRequirement(req);
    const all = KG.achievements
      .map((a) => scoreMatch(a, r))
      .sort((x, y) => y.score - x.score);
    return { requirement: r, top: all.slice(0, 3), all };
  }

  function registerDemand(req) {
    if (!req.id) req.id = 'rq_' + Date.now();
    KG.requirements.push(req);
    rebuild();
    return req;
  }

  function registerAchievement(a) {
    if (!a.id) a.id = 'ac_' + Date.now();
    KG.achievements.push(a);
    rebuild();
    return a;
  }


  function renderKG(container, req, top) {
    if (!container || typeof echarts === 'undefined') return;
    const chart = echarts.getInstanceByDom(container) || echarts.init(container);
    const nodeMap = {}, links = [];
    const cats = ['需求', '领域', '成果', '知识产权'];
    function addNode(id, name, category, size, value) {
      if (!nodeMap[id]) nodeMap[id] = { id, name, category, symbolSize: size, value: value || 0 };
    }
    function addLink(so, ta, val) { links.push({ source: so, target: ta, value: val }); }
    addNode('req', req.name, 0, 46, 1);
    addNode('d_' + req.field, req.field, 1, 30);
    addLink('req', 'd_' + req.field, 1);
    (top || []).forEach((r) => {
      const aid = 'a_' + r.name;
      addNode(aid, r.name, 2, 26, r.score);
      addLink('req', aid, r.score / 100);
      addNode('d_' + r.field, r.field, 1, 22);
      addLink(aid, 'd_' + r.field, 0.6);
      if (r.ip) { addNode('ip_' + r.name, r.ip, 3, 15); addLink(aid, 'ip_' + r.name, 0.4); }
    });
    chart.setOption({
      tooltip: {},
      legend: { data: cats, bottom: 0, icon: 'circle' },
      series: [{
        type: 'graph', layout: 'force', roam: true, draggable: true,
        categories: cats.map((n) => ({ name: n })),
        data: Object.values(nodeMap), links,
        label: { show: true, position: 'right', fontSize: 10 },
        force: { repulsion: 220, edgeLength: [70, 130] },
        lineStyle: { color: 'source', opacity: 0.55, width: 1 },
        emphasis: { focus: 'adjacency' }
      }]
    }, true);
  }

  const Matching = {
    KG, tokenize, computeMatch, renderKG, registerDemand, registerAchievement,
    guessField, buildRequirementFromText, scoreMatch, cosine
  };
  global.Matching = Matching;
  if (typeof module !== 'undefined' && module.exports) module.exports = Matching;
})(typeof window !== 'undefined' ? window : globalThis);

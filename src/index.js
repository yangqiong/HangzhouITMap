
let $map = document.getElementById('map');
let map = new AMap.Map('map', {
    zoom: 12, center: [120.119031, 30.258517],
});

// 标记点
let masses = [];

// 公司数据
let companies = window.companies.map((company) => {
    let location = company.location.split(',');
    return {
        lnglat: location,
        id: company.companyId,
        positionNum: company.positionNum,
        name: company.companyShortName,
        financeStage: company.financeStage,
        companySize: company.companySize
    }
})

// 地图标记样式
let styles = [];
for (let i = 1; i <= 5; i++){
    let pointSize = (i + 1) * 5;
    styles.push({
        url: 'point.png',
        anchor: new AMap.Pixel(6, 6),
        size: new AMap.Size(pointSize, pointSize)
    })
}

// 首次渲染页面
render(companies);

let financeStage = '';
let companySize = '';

document.addEventListener('change', function (event) {
    if (event.target.id === 'financeStage') {
        financeStage = event.target.value;
    }
    if (event.target.id === 'companySize') {
        companySize = event.target.value;
    }

    let selectedCompanies = companies.filter(function(company){
        console.log(financeStage, company.financeStage)
        console.log(companySize, company.companySize)
        if (financeStage && company.financeStage !== financeStage){
            return false;
        }
        if (companySize && company.companySize !== companySize){
            return false;
        }
        return true;
    })
    console.log(111111111, financeStage, companySize, selectedCompanies.length);
    render(selectedCompanies);
})

// 清空标记点
function clear(){
    map.remove(masses);
    masses = [];
}

function render(companies){
    clear();

    // 地图标记
    let maxLevel = 5;
    for (let level = 0; level < maxLevel; level++) {
        let positionMin = level * 50;
        let positionMax = (level + 1) * 50;
        let data = companies.filter((company) => company.positionNum >= positionMin && company.positionNum < positionMax)
        if (level === (maxLevel - 1)){
            data = companies.filter((company) => company.positionNum >= positionMin)
        }
        masses.push(
            new AMap.MassMarks(data, {
                opacity: 0.8,
                zIndex: maxLevel - level,
                cursor: 'pointer',
                style: styles[level]
            })
        )
    }

    masses.map((mass) => {
        mass.on('mouseover', function (e) {
            marker.setIcon({ content: e.data.logo });
            marker.setPosition(e.data.lnglat);
            marker.setLabel({ content: e.data.name })
        });
    
        mass.on('click', function (e) {
            window.open('https://www.lagou.com/gongsi/' + e.data.id + '.html', '_blank')
        });
    })

    let marker = new AMap.Marker({ content: ' ', map: map });
    for (let i = 0; i < masses.length; i++) {
        masses[i].setMap(map);
    }
}
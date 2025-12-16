import React from 'react';
// --- DATA STRUCTURES ---

// 1. KPI Data (Top Row)
const kpiData = [
    {
        title: 'Total ESG Initiative Costs',
        value: '$1.33 M',
        change: '5.0%',
        changeClass: 'text-green-500 dark:text-green-400', // Harmonized green for positive
        comparison: '$1.40 M',
        period: 'Previous period',
    },
    {
        title: 'Overall Satisfaction Score',
        value: '4.5',
        change: '-4.3%',
        changeClass: 'text-red-500 dark:text-red-400', // Harmonized red for negative
        comparison: '4.7',
        period: 'Previous period',
    },
    {
        title: 'Waste Diversion Rate',
        value: '58%',
        change: '-6.8%',
        changeClass: 'text-red-500 dark:text-red-400',
        comparison: '62%',
        period: 'Previous period',
    },
    {
        title: '% of Properties Using Renewable Energy',
        value: '35%',
        change: '25%',
        changeClass: 'text-green-500 dark:text-green-400',
        comparison: '28%',
        period: 'Previous period',
    },
];

// 2. ESG Initiative Costs Data (Bar Chart)
const barChartData = [
    { property: 'A', investment: 200000, heightClass: 'h-[40%]', label: '$200K' },
    { property: 'B', investment: 600000, heightClass: 'h-[100%]', label: '$600K' },
    { property: 'C', investment: 300000, heightClass: 'h-[60%]', label: '$300K' },
    { property: 'D', investment: 150000, heightClass: 'h-[30%]', label: '$150K' },
    { property: 'E', investment: 480000, heightClass: 'h-[96%]', label: '$480K' },
];

// 3. Community and Tenant Satisfaction Data (Heatmap)
const satisfactionCategories = [
    'Cleanliness',
    'Safety',
    'Community Engagement',
    'Responsiveness',
    'Amenities',
];
const properties = ['P1', 'P2', 'P3', 'P4', 'P5'];
// Adjusted color scale for better dark mode visibility and consistency (using Blue instead of Cyan/Teal)
const heatmapData = [
    'bg-blue-100 dark:bg-blue-900', 'bg-blue-300 dark:bg-blue-700', 'bg-blue-500 dark:bg-blue-500', 'bg-blue-200 dark:bg-blue-800', 'bg-blue-600 dark:bg-blue-400',
    'bg-blue-300 dark:bg-blue-700', 'bg-blue-500 dark:bg-blue-500', 'bg-blue-200 dark:bg-blue-800', 'bg-blue-600 dark:bg-blue-400', 'bg-blue-100 dark:bg-blue-900',
    'bg-blue-500 dark:bg-blue-500', 'bg-blue-200 dark:bg-blue-800', 'bg-blue-600 dark:bg-blue-400', 'bg-blue-100 dark:bg-blue-900', 'bg-blue-300 dark:bg-blue-700',
    'bg-blue-200 dark:bg-blue-800', 'bg-blue-600 dark:bg-blue-400', 'bg-blue-100 dark:bg-blue-900', 'bg-blue-300 dark:bg-blue-700', 'bg-blue-500 dark:bg-blue-500',
    'bg-blue-600 dark:bg-blue-400', 'bg-blue-100 dark:bg-blue-900', 'bg-blue-300 dark:bg-blue-700', 'bg-blue-500 dark:bg-blue-500', 'bg-blue-200 dark:bg-blue-800',
];

// 4. LEED/BREEAM certifications Data (Detailed List)
const certificationData = [
    {
        property: 'Building A',
        certifications: [
            { label: 'Certification', value: 'LEED Gold', className: 'text-green-500 dark:text-green-400', border: true, },
            { label: 'Status', value: 'Active', className: 'text-green-500 dark:text-green-400', border: true, },
            { label: 'Certification Date', value: '2023-01-20', className: 'text-gray-700 dark:text-gray-400', border: false, },
        ],
    },
    {
        property: 'Building B',
        certifications: [
            { label: 'Certification', value: 'BREEAM Very Good', className: 'text-blue-500 dark:text-blue-400', border: true, }, // Changed to Blue
            { label: 'Status', value: 'Active', className: 'text-blue-500 dark:text-blue-400', border: true, },
            { label: 'Certification Date', value: '2024-04-30', className: 'text-gray-700 dark:text-gray-400', border: false, },
        ],
    },
    {
        property: 'Building C',
        certifications: [
            { label: 'Certification', value: 'LEED Silver', className: 'text-amber-500 dark:text-amber-400', border: true, },
            { label: 'Status', value: 'Expired', className: 'text-red-500 dark:text-red-400', border: true, }, // Changed to Red
            { label: 'Certification Date', value: '2018-11-03', className: 'text-gray-700 dark:text-gray-400', border: false, },
        ],
    },
    {
        property: 'Building D',
        certifications: [
            { label: 'Certification', value: 'Uncertified', className: 'text-gray-500 dark:text-gray-400', border: true, },
            { label: 'Status', value: 'N/A', className: 'text-gray-500 dark:text-gray-400', border: false, },
            { label: 'Certification Date', value: '', className: 'text-gray-700 dark:text-gray-400', border: false, },
        ],
    },
];

// 5. Key ESG Progress Indicators Data (Progress Circles)
const progressKpiData = [
    {
        title: 'Water Intensity Reduction',
        value: 72,
        unit: '%',
        subtext: 'Achieved',
        target: 'Target: 30% reduction',
        color: '#20c997', // Custom Teal-like for Primary Metric
        darkModeColor: '#40e8a7'
    },
    {
        title: 'Renewable Energy Mix',
        value: 88,
        unit: '%',
        subtext: 'In-Use',
        target: 'Goal: 90% in portfolio',
        color: '#4950f6', // Bright Blue for a Key Goal
        darkModeColor: '#6670ff'
    },
    {
        title: 'Employee Diversity Ratio',
        value: 65,
        unit: '%',
        subtext: 'Diverse Roles',
        target: 'Target: 70% balanced',
        color: '#fd7e14', // Orange-Red for Social Metric
        darkModeColor: '#ff9640'
    },
    {
        title: 'Board Governance Score',
        value: 91,
        unit: '%',
        subtext: 'Compliance',
        target: 'Industry average: 85%',
        color: '#6f42c1', // Purple for Governance Metric
        darkModeColor: '#8c60e8'
    },
];


// --- REUSABLE COMPONENTS ---

// 1. KPI Card (Top Row)
const KpiCard = ({ title, value, change, changeClass, comparison, period }) => (
    <div className="bg-white font-dm dark:bg-gray-800 p-3 rounded-2xl shadow-xl flex flex-col justify-between border border-gray-700 dark:border-gray-500 h-36 transition-colors">
        <p className="text-sm font-dm font-semibold text-gray-600 dark:text-gray-400 text-center">{title}</p>
        <div className="text-3xl font-dm font-semibold text-blue-950 dark:text-white mt-1 text-center">{value}</div>
        <hr></hr>
        <div className="flex space-x-2 font-dm text-sm mt-2 gap-4 justify-between items-center">
            <span className={`font-bold ${changeClass} font-dm`}>{change}  vs.</span>
            <span className="text-gray-600 dark:text-gray-400 font-dm"> {comparison} {period}</span>
        </div>
    </div>
);

// 2. ESG Initiative Costs (Bar Chart)
const ESGInitiativeCostsCard = () => (
    <div className="bg-white dark:bg-gray-800 font-dm p-6 rounded-2xl shadow-xl flex flex-col border border-gray-700 dark:border-gray-500 h-96 transition-colors">
        <h4 className="text-lg font-bold mb-4 font-dm text-blue-950 dark:text-white">ESG Initiative Costs</h4>

        <div className="flex-1 bg-gray-50 font-dm dark:bg-gray-700 rounded-xl p-4 flex flex-col relative justify-end">
            <h5 className="text-sm font-dm font-semibold text-gray-600 dark:text-gray-300 mb-2 ml-8">Investment Amount by Property</h5>

            {/* Y-Axis Labels (Simulated) - Adjusted Positioning */}
            <div className="absolute  font-dm top-4 left-0 pl-2 pr-1 text-xs text-gray-600 dark:text-gray-400 flex flex-col justify-between h-[80%]">
                <span>$600K</span>
                <span>$450K</span>
                <span>$300K</span>
                <span>$150K</span>
                <span>$0</span>
            </div>
            
            {/* Chart Area */}
            <div className="flex font-dm  items-end justify-around h-[80%] border-b-2 border-gray-700 dark:border-gray-500 pl-[50px]">
                {barChartData.map((data, index) => (
                    <div key={index} className="flex  font-dm flex-col items-center w-1/5 h-full justify-end">
                        <div className="text-xs font-dm  text-gray-700 dark:text-gray-300 font-medium mb-1">{data.label}</div>
                        <div className={`w-3/4  font-dm  bg-blue-600 dark:bg-blue-500 rounded-t-md ${data.heightClass} hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors`}></div>
                    </div>
                ))}
            </div>

            {/* X-Axis Labels */}
            <div className="flex font-dm   justify-around text-xs text-gray-700 dark:text-gray-300 font-medium pt-2 pl-[50px]">
                {barChartData.map((data, index) => (
                    <span key={index} className="w-1/5 font-dm   text-center">{data.property}</span>
                ))}
            </div>
            <div className="text-center text-xs font-dm   text-gray-600 dark:text-gray-400 pt-1">Property</div>
        </div>
    </div>
);

// 3. Community and Tenant Satisfaction (Heatmap)
const CommunitySatisfactionCard = () => (
    <div className="bg-white dark:bg-gray-800 font-dm   p-6 rounded-2xl shadow-xl flex flex-col border border-gray-700 dark:border-gray-500 h-96 transition-colors">
        <h4 className="text-lg font-bold mb-4 font-dm   text-blue-950 dark:text-white">Community and Tenant Satisfaction</h4>

        <div className="flex-grow bg-gray-50 font-dm   dark:bg-gray-700 rounded-xl p-2 flex flex-col overflow-hidden">
            {/* Top X-Axis Labels (Not Satisfied vs. Very Satisfied) */}
            <div className="flex-none flex justify-end font-dm   items-center text-xs text-gray-600 dark:text-gray-400 font-medium pb-1 pr-1 h-6">
                <div className="flex  font-dm  justify-between w-[calc(100%-100px)]">
                    <span className="text-xs font-dm  ">Not Satisfied</span>
                    <span className="text-xs font-dm  ">Very Satisfied</span>
                </div>
            </div>

            <div className="flex-1  font-dm  flex pt-2">
                {/* Y-Axis Labels (Satisfaction Categories) */}
                <div className="flex flex-col  font-dm  shrink-0 w-[100px] text-right pr-2">
                    <div className="flex items-center font-dm   justify-center text-gray-600 dark:text-gray-400 text-xs font-semibold w-full h-4 leading-tight mb-2">
                        Category
                    </div>
                    <div className="flex flex-col  font-dm  justify-between text-xs text-gray-800 dark:text-gray-200 font-medium h-full">
                        {satisfactionCategories.map((category) => (
                            <span key={category} className="h-full font-dm  flex items-center justify-end">{category}</span>
                        ))}
                    </div>
                </div>

                {/* Heatmap Grid */}
                <div
                    id="heatmap-grid"
                    className="flex-1 font-dm grid grid-cols-5 grid-rows-5 gap-0.5 border border-gray-700 dark:border-gray-500  rounded-md overflow-hidden h-full">
                    {heatmapData.map((colorClass, index) => (
                        <div key={index} className={colorClass}></div>
                    ))}
                </div>
            </div>

            {/* Bottom X-Axis Labels (Properties P1-P5) */}
            <div className="flex-none text-xs font-dm text-gray-800 dark:text-gray-200 font-semibold mt-3 pl-[100px]">
                <div id="x-axis-properties" className="flex justify-around">
                    {properties.map((prop) => (
                        <span key={prop} className="w-1/5 font-dm text-center">{prop}</span>
                    ))}
                </div>
                <div className="text-center font-dm text-gray-600 dark:text-gray-400 pt-1">Property</div>
            </div>
        </div>
    </div>
);

// 4. LEED/BREEAM certifications (Detailed List)
const LEEDCertificationsCard = () => (
    <div className="bg-white dark:bg-gray-800 font-dm p-6 rounded-2xl shadow-xl flex flex-col border border-gray-700 dark:border-gray-500  h-96 transition-colors">
        <h4 className="text-lg font-bold mb-4 font-dm text-blue-950 dark:text-white">LEED/BREEAM certifications</h4>

        <div className="flex-1 bg-gray-50 font-dm  dark:bg-gray-700 rounded-xl p-4 relative overflow-auto">
            {/* Header (Sticky Table Header) */}
            <div className="sticky top-0 bg-gray-50 font-dm dark:bg-gray-700 grid grid-cols-5 text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 z-10 transition-colors">
                <span className="col-span-2 text-left font-dm ">Property</span>
                <span className="col-span-2 text-left font-dm ">Certification Details</span>
                <span className="col-span-1 text-right font-dm ">Value</span>
            </div>

            <div className="space-y-3">
                {certificationData.map((building, buildingIndex) => (
                    <div
                        key={building.property}
                        className={`pl-3 ${buildingIndex < certificationData.length - 1 ? 'border-b font-dm  border-gray-700 dark:border-gray-500 pb-3' : 'pb-3'} ${buildingIndex > 0 ? 'pt-3' : ''}`}
                    >
                        {/* Property Name */}
                        <div className="font-bold text-base text-blue-950 font-dm  dark:text-white mb-1">{building.property}</div>

                        {/* Certification Details */}
                        {building.certifications.map((cert, certIndex) => {
                            const isLastCert = certIndex === building.certifications.length - 1;
                            const isFirstCert = certIndex === 0;

                            let classes = 'grid grid-cols-5 text-sm font-dm  text-gray-700 dark:text-gray-300';
                            if (!isLastCert) {
                                classes += ' border-b border-dashed font-dm border-gray-700 dark:border-gray-500  pb-1';
                            }
                            if (!isFirstCert && !isLastCert) {
                                classes += ' py-1';
                            }
                            if (isLastCert && !isFirstCert) {
                                classes += ' pt-1';
                            }

                            return (
                                <div key={`${building.property}-${cert.label}`} className={classes}>
                                    <span className="col-span-2 font-dm text-left">{cert.label}</span>
                                    <span className={`col-span-2 font-dm text-left ${cert.className}`}>{cert.value}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// 5. Progress Indicator Card (Bottom Row)
const ProgressIndicatorCard = ({ title, value, unit, subtext, target, color, darkModeColor }) => {
    const finalColor = darkModeColor || color;
    const angle = (value / 100) * 360;

    const progressStyle = {
        background: `conic-gradient(${finalColor} ${angle}deg, #e5e7eb ${angle}deg)`, // Lighter gray for light mode background
    };
    
    const darkProgressStyle = {
        background: `conic-gradient(${finalColor} ${angle}deg, #374151 ${angle}deg)`, // gray-700 equivalent for dark mode empty space
    };


    return (
        <div
            className="bg-white font-dm  dark:bg-gray-800 p-6 rounded-2xl shadow-xl h-72 flex flex-col items-center justify-between border border-gray-700 dark:border-gray-500 transition-colors"
        >
            <h4 className="text-lg font-dm font-bold text-blue-950 dark:text-white">{title}</h4>
            
            {/* The Circular Progress Bar container - relies on custom CSS in ESGDashboard.css */}
            {/* Note: In a real app, you would toggle 'progress-container' style based on isDark state. 
                 For this static example, I'll rely on external CSS to define the size/shape, and use inline style for color */}
            <style jsx global>{`
                .progress-container {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .progress-inner-circle {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                /* You would define a utility to check dark mode */
                /* For now, using the darkProgressStyle in a simplified way that doesn't fully represent a toggled theme */
            `}</style>
            
            {/* Using the color logic in a simplified way */}
            <div className="progress-container" style={progressStyle}>
                {/* Fallback for dark mode in a real app would be better handled with CSS variables or state */}
                <div className="progress-inner-circle bg-white dark:bg-gray-800">
                    <span className="text-3xl font-dm font-extrabold" style={{ color: finalColor }}>
                        {value}{unit}
                    </span>
                    <span className="text-xs font-dm text-gray-600 dark:text-gray-400">{subtext}</span>
                </div>
            </div>

            <p className="text-sm font-dm text-gray-600 dark:text-gray-400 mt-2 text-center">{target}</p>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---

const ESGDashboard = () => {
    // You would typically include state here to manage the dark/light mode toggle
    
    return (
        <div className="p-8 min-h-screen font-dm bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-sans">
            {/* 1. Top KPI Row */}
            <div className="grid grid-cols-1 font-dm md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {kpiData.map((kpi, index) => (
                    <KpiCard key={index} {...kpi} />
                ))}
            </div>

            {/* 2. Real Estate Sustainability & ESG Breakdown (Middle Section) */}
            <h3 className="text-2xl font-dm font-extrabold text-blue-950 dark:text-white mb-6">
                Real Estate Sustainability & ESG Breakdown
            </h3>
            <div className="grid grid-cols-1 font-dm lg:grid-cols-3 gap-6 mb-10">
                <ESGInitiativeCostsCard />
                <CommunitySatisfactionCard />
                <LEEDCertificationsCard />
            </div>

            {/* 3. Key ESG Progress Indicators (Bottom Section) */}
            <div className="mt-0 p-0">
                <h3 className="text-2xl font-dm font-extrabold text-blue-950 dark:text-white mb-6">
                    Key ESG Progress Indicators
                </h3>

                <div className="grid font-dm grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {progressKpiData.map((data, index) => (
                        <ProgressIndicatorCard
                            key={index}
                            title={data.title}
                            value={data.value}
                            unit={data.unit}
                            subtext={data.subtext}
                            target={data.target}
                            color={data.color}
                            darkModeColor={data.darkModeColor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ESGDashboard;
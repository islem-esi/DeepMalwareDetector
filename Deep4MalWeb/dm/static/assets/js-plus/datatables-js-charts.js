var mal_legit = document.getElementById('mal-legit').getContext('2d');
var mlg_chart = new Chart(mal_legit, {
    type: 'pie',
    data: {
        datasets: [{
            data: [33,66],
            backgroundColor :["#1d7af3","#f3545d","#fdaf4b"],
            borderWidth: 0
        }],
        labels: ['Benign', 'Mals']
    },
    options : {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            position : 'bottom',
            labels : {
                fontColor: 'rgb(3,0,1)',
                fontSize: 11,
                usePointStyle : true,
                padding: 5
            }
        },
        pieceLabel: {
            render: 'percentage',
            fontColor: 'white',
            fontSize: 14,
        },
        tooltips: true,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    }
});

var legit_src = document.getElementById('legit-src').getContext('2d');
var  legit_src = new Chart(legit_src, {
    type: 'pie',
    data: {
        datasets: [{
            data: [8000,400,1500, 1000],
            backgroundColor :["#1d7af3","#f3545d","#fdaf4b", "#008877"],
            borderWidth: 0
        }],
        labels: ['W10', 'XP', 'R12', 'APP']
    },
    options : {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            position : 'bottom',
            labels : {
                fontColor: 'rgb(0,0,0)',
                fontSize: 11,
                usePointStyle : true,
                padding: 5
            }
        },
        pieceLabel: {
            render: 'percentage',
            fontColor: 'white',
            fontSize: 14,
        },
        tooltips: true,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    }
});
var mals_numbers = document.getElementById('mals-numbers').getContext('2d');
var  malsnumbers = new Chart(mals_numbers, {
    type: 'pie',
    data: {
        datasets: [{
            data: [5000,15000,5000],
            backgroundColor :["#1d7af3","#f3545d","#fdaf4b", "#008877"],
            borderWidth: 0
        }],
        labels: ['2018', '2019', '2020']
    },
    options : {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            position : 'bottom',
            labels : {
                fontColor: 'rgb(0,0,0)',
                fontSize: 11,
                usePointStyle : true,
                padding: 5
            }
        },
        pieceLabel: {
            render: 'percentage',
            fontColor: 'white',
            fontSize: 14,
        },
        tooltips: true,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    }
});


$(function () {
  loadGroups();
  RenderGraph();
  $("#group-by-tg").bootstrapSwitch({'size': 'mini'});
  $("#group-by-ref").bootstrapSwitch({'size': 'mini'});
});

$('#group-list').live('change', function(e) {
  group = e.target.options[e.target.selectedIndex].value;
  if (group != "0")
  {
    delete params['destination'];
    delete params['reflectors'];
    $("#group-by-ref").bootstrapSwitch('state', false);
    $("#group-by-tg").bootstrapSwitch('state', false);
    params['talkgroup'] = group;
  }
  else delete params['talkgroup'];
  RenderGraph();
});

$('#group-by-tg').on('switchChange.bootstrapSwitch', function() {
  if ($(this).is(':checked'))
  {
    delete params['talkgroup'];
    delete params['reflectors'];
    params['destination'] = 1;
    $("#group-by-ref").bootstrapSwitch('state', false);
    $("#group-list").prop('selectedIndex', 0);
  }
  else
  {
    delete params['destination'];
  }
  RenderGraph();
});

$('#group-by-ref').on('switchChange.bootstrapSwitch', function() {
  if ($(this).is(':checked'))
  {
    delete params['talkgroup'];
    delete params['destination'];
    params['reflectors'] = 1;
    $("#group-by-tg").bootstrapSwitch('state', false);
    $("#group-list").prop('selectedIndex', 0);
  }
  else
  {
    delete params['reflectors'];
  }
  RenderGraph();
});

function RenderGraph()
{
  initCharts();  
  $('#container1').highcharts().showLoading();
  $('#container2').highcharts().showLoading();
  var filters = "";
  if (params['talkgroup']) filters = filters + '&talkgroup='+params['talkgroup'];
  if (params['repeater']) filters = filters + '&repeater='+params['repeater'];
  if (params['totalcount']) filters = filters + '&totalcount='+params['totalcount'];
  var days = 2;
  if (params['repeater']) days = 15;
  if (params['destination'])
  {
    var data_url = 'https://bm-lastheard.pi9noz.ampr.org/stats/?groupdst=1&days='+days+'&totalcount=5'+filters+'&callback=?'
    var data_url_sec = 'https://bm-lastheard.pi9noz.ampr.org/stats/?groupdst=1&days='+days+'&totalcount=5'+filters+'&seconds=1&callback=?'
  }
  else if (params['reflectors'])
  {
    var data_url = 'https://bm-lastheard.pi9noz.ampr.org/stats/?groupref=1&days='+days+'&totalcount=5'+filters+'&callback=?'
    var data_url_sec = 'https://bm-lastheard.pi9noz.ampr.org/stats/?groupref=1&days='+days+'&totalcount=5'+filters+'&seconds=1&callback=?'
  }
  else
  {
    var data_url = 'https://bm-lastheard.pi9noz.ampr.org/stats/?days=30'+filters+'&totalcount=5&callback=?'
    var data_url_sec = 'https://bm-lastheard.pi9noz.ampr.org/stats/?days=30'+filters+'&totalcount=5&seconds=1&callback=?'
  }
  
  $.getJSON(data_url, function (jsondata) {
    //Generate total
    qso = [];
    destination = {};
    var chart = $('#container1').highcharts();
    for (index in jsondata)
    {
      if (jsondata[index]['qso'])
      {
        qso.push([parseInt(index), jsondata[index]['qso']]);
      }
      else if (jsondata[index][0]['destination'])
      {
        for(tgindex in jsondata[index])
        {
          if (destination[jsondata[index][tgindex]['destination']] == undefined) destination[jsondata[index][tgindex]['destination']] = [];
          destination[jsondata[index][tgindex]['destination']].push([parseInt(index), jsondata[index][tgindex]['qso']]);
        }
      }
    }
    if (params['destination'] || params['reflectors'])
    {
      for(index in destination)
      { 
        if (params['repeater'] == undefined && params['reflectors'] == undefined && ( index == 0 || index > 999 ) ) continue
        if (params['reflectors'] && (index < 4000 || index > 5000 || index=="null")) continue
        talkgroup = getGroupName(index,0)
        if (talkgroup == "") talkgroup = index;
        var sIndex = findByProperty(chart.series,'name',talkgroup);
        if (sIndex > -1)
          chart.series[sIndex].setData(destination[index],false);
        else 
          chart.addSeries({type: 'area', name: talkgroup,data: destination[index]}, false);
      }
    } 
    else
      chart.addSeries({type: 'area', name: php_lang['Calls']['Total'],data: qso}, false);
    chart.redraw();
    chart.hideLoading();
  });

  //Generate Seconds chart
  $.getJSON(data_url_sec, function (jsondata) {
    //Generate total
    qso = [];
    destination = {};
    var chart = $('#container2').highcharts();
    for (index in jsondata)
    {
      if (jsondata[index]['qso'])
      {
        qso.push([parseInt(index), jsondata[index]['qso']*1000]);
      }
      else if ($.isArray(jsondata[index]))
      {
        for(tgindex in jsondata[index])
        {
          if (destination[jsondata[index][tgindex]['destination']] == undefined) destination[jsondata[index][tgindex]['destination']] = [];
          destination[jsondata[index][tgindex]['destination']].push([parseInt(index), jsondata[index][tgindex]['qso']*1000]);
        }
      }
    }
    if (params['destination'] || params['reflectors'])
    {
      for(index in destination)
      { 
        if (params['repeater'] == undefined && params['reflectors'] == undefined && ( index == 0 || index > 999 ) ) continue
        if (params['reflectors'] && (index < 4000 || index > 5000 || index=="null")) continue
        talkgroup = getGroupName(index,0)
        if (talkgroup == "") talkgroup = index;
        var sIndex = findByProperty(chart.series,'name',talkgroup);
        if (sIndex > -1)
          chart.series[sIndex].setData(destination[index],false);
        else 
          chart.addSeries({type: 'area', name: talkgroup,data: destination[index]}, false);
      }
    } 
    else
      chart.addSeries({type: 'area', name: php_lang['Calls']['Total'],data: qso}, false);
    chart.redraw();
    chart.hideLoading();
  });
}

function initCharts()
{
    $('#container1').highcharts({
      chart: {
        zoomType: 'x',
        type: 'area'
      },
      title: {
        text: php_lang['Calls']['QSOs per Hour']
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          php_lang['Calls']['ClickZoom'] : php_lang['Calls']['PinchZoom']
        },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: php_lang['Calls']['QSOs']
        },
        min: 0
      },
      legend: {
        enabled: true 
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [ ] 
    });
    $('#container2').highcharts({
      chart: {
        zoomType: 'x',
        type: 'area'
      },
      title: {
        text: php_lang['Calls']['Time per Hour']
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          php_lang['Calls']['ClickZoom'] : php_lang['Calls']['PinchZoom']
        },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { //force all formats to be hour:minute:second
            second: '%H:%M:%S',
            minute: '%H:%M:%S',
            hour: '%H:%M:%S',
            day: '%H:%M:%S',
            week: '%H:%M:%S',
            month: '%H:%M:%S',
            year: '%H:%M:%S'
        },
        title: {
          text: php_lang['Calls']['Seconds']
        },
        min: 0
      },
      legend: {
        enabled: true 
      },
      tooltip: {
        pointFormatter: function() {
          return  "<span style=\"color:"+this.color+"\">\u25CF</span> "+this.series.name+": <b>"+Highcharts.dateFormat('%H:%M:%S', new Date(this.y))+"</b><br/>";
        }
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [ ] 
    });
}

function loadGroups() {
  var grouplist = $('#group-list');
  for (var number in groups) {
    //doe dingen
    if (number <= 5000 && number >= 4000 || number < 100) continue;

    grouplist.append( new Option(groups[number] + ' ('+number+')',number) )
  }
}

function findByProperty(objects, prop, value) {
    var index;
    $(objects).each(function(i, e) {
        if (e[prop] && e[prop] == value) {
            index = i;
            return false;
        }
    });
    return index;
}

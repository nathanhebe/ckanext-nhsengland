!function(){window.Dashboard=Ember.Application.create();Ember.Application.initializer({name:"websocketInit",initialize:function(a,b){b.set("settings",Ember.Object.create({ckanUrl:"http://52.17.101.212",directoryID:"b58a1a75-695e-4d35-9790-8f871657b662",dataID:"6fded5d7-6e24-4223-8182-26ec00423882"}))}})}(),function(){Dashboard.HeaderController=Ember.ObjectController.extend({actions:{goToReports:function(){this.get("target").transitionTo("dash","dash_1")},goToDashboard:function(){this.get("target").transitionTo("dash","dash_2")},goBackToBoardReport:function(){this.get("target").transitionTo("dash","dash_2"),this.get("target").reset()},prepareForPrint:function(){window.print()}}})}(),function(){Dashboard.IndicatorRowController=Ember.ObjectController.extend({mainTitle:function(){var a=this.get(null==this.get("subTitle")||0===this.get("subTitle").length?"title":"subTitle");return a}.property("model.title","model.subTitle"),showChart:function(){var a=this;return null!=a&&null!=a.get("currentValue")&&null!=a.get("previousValue")}.property("this.currentValue","this.previousValue")}),Dashboard.IndicatorRowConstitutionController=Dashboard.IndicatorRowController.extend({})}(),function(){Dashboard.ModalController=Ember.ObjectController.extend({actions:{close:function(){return console.log("ModalController > Close"),this.send("closeModal")}}})}(),function(){Dashboard.PageController=Ember.ObjectController.extend({_pages:null,dashID:null,pageRAGs:null,pageNoRAG:null,pages:function(){if(null!==this.get("_pages"))return this.get("_pages");var a=this.get("ragPages");return this.set("_pages",a),this.get("_pages")}.property("_pages","ragPages"),_nhsEnglandRAGTotals:null,nhsEnglandRAGTotals:function(){var a=this;if(null!=this.get("_nhsEnglandRAGTotals"))return this.get("_nhsEnglandRAGTotals");var b=this.get("ckanID");null!=b&&Dashboard.PerformanceIndicatorModel.find(b).then(function(b){a.set("_nhsEnglandRAGTotals",b)})}.property("_nhsEnglandRAGTotals")}),Ember.Handlebars.helper("ragColour",function(a){var b=Handlebars.Utils.escapeExpression(a),c="G"===b?"green":"A"===b?"amber":"A/R"===b||"R"===b?"red":"blue";return new Ember.Handlebars.SafeString(c)})}(),function(){Dashboard.DashboardModel=Ember.Object.extend({_data:null,data:function(){if(null!=this.get("_data"))return this.get("_data");var a=null,b=this.get("ckanResourceID");switch(this.get("type")){case"BoardReport":null!=b&&(a=this,Dashboard.ReportModel.find(b).then(function(b){return a.set("_data",b),a.get("_data")}));break;case"BoardReportDashboard":null!=b&&(a=this,Dashboard.ReportModel.find(b).then(function(b){var c=b.findBy("id","annex_b"),d=c.pages,e=d.findBy("id","page_1"),f=e.indicators;a.set("_data",f)}));break;case"Dashboard":if(null!=b){a=this;var c={resource_id:b},d=Dashboard.get("settings").get("ckanUrl");$.ajax({url:d+"/api/action/datastore_search",data:c}).then(function(b){var c=b.result,d=[];if(null!=c&&utils.isArray(c.records)){c.records.forEach(function(a){$.extend(a,$.parseJSON(a.config)),delete a.config;var b=Dashboard.WidgetModel.create(a);d.push(b)});var e=d.sortBy("order");a.set("_data",e)}})}}return this.get("_data")}.property("_data")}),Dashboard.DashboardModel.reopenClass({needs:["settings"],find:function(a){return this.findAll().then(function(b){return b.filterBy("id",a)[0]})},findAll:function(){var a=Dashboard.get("settings").get("ckanUrl"),b=Dashboard.get("settings").get("directoryID"),c={resource_id:b};return $.ajax({url:a+"/api/action/datastore_search",data:c}).then(function(a){var b=[],c=a.result;return c.records.forEach(function(a){var c=Dashboard.DashboardModel.create(a);b.push(c)}),b})}})}(),function(){Dashboard.DataRowModel=Ember.Object.extend({isAppendicesRow:function(){return this.get("title").toString().startsWith("*")}.property()})}(),function(){Dashboard.IndicatorModel=Ember.Object.extend({targetValue:null,_currentValue:null,_currentVal:null,_previousValue:null,_previousVal:null,_dataValues:null,_currentDate:null,_periodOfCoverage:null,_trend:null,_ragColour:null,currentValue:function(){if(null!=this.get("_currentValue"))return this.get("_currentValue");if(null==this.get("_dataValues"))return this.get("dataValues"),null;var a=this.get("_dataValues")[0];return this.set("_currentValue",a),this.get("currentValue")}.property("_dataValues","_currentValue"),previousValue:function(){if(null!=this.get("_previousValue"))return this.get("_previousValue");if(null==this.get("_dataValues"))return this.get("dataValues"),null;var a=this.get("_dataValues")[1];return this.set("_previousValue",a),this.get("_previousValue")}.property("_dataValues","_previousValue"),currentVal:function(){if(null!=this.get("_currentVal"))return this.get("_currentVal");var a=0,b=this.get("currentValue");return null!=b&&null!=b.get("val")?(a=parseFloat(parseFloat(b.get("val")).toPrecisionDigits(3)),this.set("_currentVal",a),this.get("_currentVal")):"noData"}.property("currentValue"),targetVal:function(){var a="%"===this.get("valueString")?100*this.get("ragTarget"):this.get("ragTarget");return a}.property("ragTarget"),previousVal:function(){if(null!=this.get("_previousVal"))return this.get("_previousVal");var a=0,b=this.get("previousValue");return null!=b&&null!=b.get("val")?(a=parseFloat(parseFloat(b.get("val")).toPrecisionDigits(3)),this.set("_previousVal",a),this.get("_previousVal")):"noData"}.property("previousValue"),currentDate:function(){if(null!=this.get("_currentDate"))return this.get("_currentDate");var a=this.get("currentValue");if(null!=a&&null!=a.date){var b=a.date.cleanDateFormats();return this.set("_currentDate",b),this.get("_currentDate")}return""}.property("currentValue"),periodOfCoverage:function(){if(null!=this.get("_periodOfCoverage"))return this.get("_periodOfCoverage");var a=this.get("currentValue");if(null!=a){var b=a.start_date,c=this.get("ragType");if("Constitutional"===c&&null!==b&&""!==b)this.set("_periodOfCoverage",b);else{var d=this.get("currentDate");this.set("_periodOfCoverage",d)}}return this.get("_periodOfCoverage")}.property("currentDate","_currentValue"),getRAGTarget:function(){return null!==this.get("ragTarget")&&"%"===this.get("valueString")?100*this.get("ragTarget"):this.get("ragTarget")}.property("ragTarget"),chartID:function(){return"Chart"+this.get("id")}.property(),hasValue:function(){var a=this.get("currentValue");return null==a?!1:null!=a.get("val")&&-1===a.get("val").toString().indexOf("T00:")?!0:!1}.property("currentValue"),dataValues:function(){if(null!=this.get("_dataValues"))return this.get("_dataValues");{var a=this;Dashboard.get("settings").get("ckanUrl"),Dashboard.get("settings").get("dataID")}$.ajax({url:'https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "68ebcbee-177f-42b5-a31e-8f706d4ebf50" WHERE "indicator_id" = \''+a.get("id")+'\' ORDER BY "start_date" DESC '}).then(function(b){var c=[],d=a.get("valueType");return b.result.records.forEach(function(a){c.push(Dashboard.IndicatorValueModel.create(_.extend(a,{valueType:d})))}),a.setProperties({_dataValues:c}),a.get("_dataValues")})}.property(),trend:function(){if(null!=this.get("currentVal")&&null!=this.get("previousVal")){var a=this.get("currentVal"),b=this.get("previousVal"),c=this.get("desiredDirection"),d="even";switch(c){default:d=a===b?"even":a>b?"up":"down";break;case"Down":d=a===b?"even":b>a?"up":"down"}return d}return"notrend"}.property("_currentVal","_previousVal"),valueString:function(){return"int"===this.get("valueType")?"":this.get("valueType")}.property("valueType"),regionalInfo:function(){},ragColour:function(){if(null!=this.get("currentValue")){console.log("ragColour");{var a=null;this.get("currentValue"),this.get("previousValue")}if(a=this.calculateRAG(),a!=this.get("_ragColour")&&null!=a)return this.set("_ragColour",a),this.get("_ragColour")}}.property("currentValue"),calculateRAG:function(){switch(this.get("ragType")){case"Constitutional":return this.get("constitutionalRAG");case"Standard":return this.get("standardRAG");case"Confidence":return this.get("confidenceRAG");default:return"noRAG"}},constitutionalRAG:function(){var a=null;if(null!=this.get("currentValue")){a="amber";var b=this.get("currentValue").get("val"),c=this.get("targetVal"),d=this.get("desiredDirection"),e=c+1,f=c-1;if("Up"===d){if("%"!==this.get("valueString")){if(f>b)return"red";if(b>c)return"green"}f>b?a="red":b>c&&(a="green")}else{if("%"!==this.get("valueString")){if(b>e)return"red";if(c>b)return"green"}b>e?a="red":c>b&&(a="green")}}return a}.property("ragTarget","valueString","currentValue"),standardRAG:function(){var a=null;if(null!=this.get("currentValue")&&null!=this.get("previousValue")){var b=this.get("currentValue").get("val"),c=this.get("previousValue").get("val"),d=this.get("desiredDirection"),e=null!=this.get("ragPercentChangeToUse")?this.get("ragPercentChangeToUse"):.01;a="amber","Up"===d?b>c*(1+e)?a="green":c*(1-e)>b&&(a="red"):c*(1-e)>b?a="green":b>c*(1+e)&&(a="red")}return a}.property("ragTarget","valueString","currentValue"),confidenceRAG:function(){var a=null;if(null!=this.get("currentValue")){var b=this.get("currentValue"),c=b.get("val"),d=this.get("desiredDirection"),e=b.get("upperCI"),f=b.get("lowerCI");a="amber","Up"===d?c>e?a="green":f>c&&(a="red"):e>c?a="green":c>f&&(a="red")}return a}.property("ragTarget","valueString","currentValue")}),Dashboard.IndicatorModel.reopenClass({values:null})}(),function(){Dashboard.IndicatorValueModel=Ember.Object.extend({_val:null,val:function(){if(null==this.get("_val")){switch(this.get("valueType")){default:this.set("_val",utils.parseNumber(this.get("value")));break;case"%":this.set("_val",100*utils.parseNumber(this.get("value")))}return this.get("_val")}return this.get("_val")}.property("value","valueType"),upperCI:function(){return null!=this.get("uci")?this.get("uci"):utils.random(this.get("val")-3,this.get("val")+3)}.property("uci"),lowerCI:function(){if(null!=this.get("uci"))return this.get("lci");var a=this.get("upperCI");return utils.random(a-1,a-4)}.property("uci")}),Dashboard.IndicatorModel.reopenClass({})}(),function(){Dashboard.PageModel=Ember.Object.extend({_rows:null,rows:function(){if(null===this.get("_rows")){var a=this;switch(this.get("type")){case"page_finance":case"page_finance_table":case"page_supplimentary_business":case"page_supplimentary_risks":if(null===this.get("_rows")&&null!==this.get("ckanID")){var b=a.get("ckanID"),c=Dashboard.get("settings").get("ckanUrl");$.ajax({url:c+'/api/action/datastore_search_sql?sql=SELECT * from "'+b+'"'}).then(function(b){var c=[];b.result.records.forEach(function(a){var b=Dashboard.DataRowModel.create(a);c.push(b)}),a.setProperties({_rows:c})})}return a.get("_rows")}}return this.get("_rows")}.property("_rows"),_mainRAGs:null,_noTrendRAG:null,mainRAGs:function(){return null==this.get("_mainRAGs")&&this.calculateRAG(),this.get("_mainRAGs")}.property("_mainRAGs"),noTrendRAG:function(){return null==this.get("_noTrendRAG")&&this.calculateRAG(),this.get("_noTrendRAG")}.property("noTrendRAG"),calculateRAG:function(){console.log("RAG STATUS");{var a=[{colour:"red",count:0,previous:0},{colour:"amberRed",count:0,previous:0},{colour:"amber",count:0,previous:0},{colour:"amberGreen",count:0,previous:0},{colour:"green",count:0,previous:0},{colour:"noRAG",count:0,previous:0}];this.get("id")}this.get("indicators").forEach(function(b){var c=b.get("ragColour");null==a.findBy("colour",c)&&a.push({colour:c,count:0,previous:0}),a.findBy("colour",c).count++});var b=a.filter(function(a){return"noRAG"!=a.colour?!0:!1}),c=a.findBy("colour","noRAG");this.set("_mainRAGs",b),this.set("_noTrendRAG",c)}.observes("indicators.@each._ragColour"),_data:null,data:function(){if(null===this.get("_data"))switch(this.get("type")){case"page_finance":return null;case"page_finance_table":return null;case"page_supplimentary_business":return null;case"page_supplimentary_risks":var a=this;if(null===this.get("_data")&&null!==this.get("ckanID")){var b=this.get("ckanID"),c=Dashboard.get("settings").get("ckanUrl");$.ajax({url:c+'/api/action/datastore_search_sql?sql=SELECT * from "'+b+'"'}).then(function(b){var c,d,e={sections:[]};b.result.records.forEach(function(a){if("section"===a.type)c={title:a.sectionTitle,groups:[]},e.sections.push(c);else if("group"===a.type)d={title:a.groupTitle,indicators:[]},c.groups.push(d);else if("indicator"===a.type){var b=function(a){switch(a){case"A/R":return"amberRed";case"R":return"red";case"A":return"amber";case"A/G":return"amberGreen";case"G":return"green"}};a.trend=a.col3,a.rag=a.col4,a.mitigatedRAG=a.col5,a.ragCode=b(a.rag),a.mitigatedRAGCode=b(a.mitigatedRAG),a.achieveDate=a.col6,delete a.col3,delete a.col4,delete a.col5,delete a.col6,d.indicators.push(a)}}),a.set("data",e)})}return a.get("_data");case"page_supplimentary_text":var a=this;if(null===this.get("_data")&&null!==this.get("ckanID")){var b=this.get("ckanID"),c=Dashboard.get("settings").get("ckanUrl");$.ajax({url:"http://52.16.158.169/dataset/cb6fe8e4-66e3-4c03-80b1-20b850c84251/resource/60bf1f30-1a6c-4482-a8ee-d76d791fc1bd/download/boardreportperformancereportintro.txt"}).then(function(b){var c=Handlebars.Utils.escapeExpression(b);c=c.replace(/(\r\n|\n|\r)/gm,"<br>"),c=new Handlebars.SafeString(c),a.set("_data",c)})}return a.get("_data")}return this.get("_data")}.property("_data")})}(),function(){Dashboard.PerformanceIndicatorModel=Ember.Object.extend({}),Dashboard.PerformanceIndicatorModel.reopenClass({find:function(a){var b=Dashboard.get("settings").get("ckanUrl");return $.ajax({url:b+"/api/action/datastore_search?resource_id="+a}).then(function(a){var b=a.result.records,c=[],d={red:0,amberRed:0,amber:0,amberGreen:0,green:0,missing:0},e={red:0,amberRed:0,amber:0,amberGreen:0,green:0,missing:0},f=_.groupBy(b,"id");_.each(f,function(a){var b=_.sortBy(a,"date").reverse(),f=_.first(b),g=b[1],h=Dashboard.PerformanceIndicatorModel.create({title:f.title,id:f.id,current:f,previous:g});d.red+=parseFloat(f.red),d.amberRed+=parseFloat(f.amberRed),d.amber+=parseFloat(f.amber),d.amberGreen+=parseFloat(f.amberGreen),d.green+=parseFloat(f.green),d.missing+=parseFloat(f.missing)||0,e.red+=parseFloat(g.red),e.amberRed+=parseFloat(g.amberRed),e.amber+=parseFloat(g.amber),e.amberGreen+=parseFloat(g.amberGreen),e.green+=parseFloat(g.green),e.missing+=parseFloat(g.missing)||0,c.push(h)});var g=Dashboard.PerformanceIndicatorModel.create({title:"NHS England Totals",current:d,previous:e});return c.push(g),c})}})}(),function(){Dashboard.ReportModel=Ember.Object.extend({}),Dashboard.ReportModel.reopenClass({find:function(a){var b={resource_id:a},c=Dashboard.get("settings").get("ckanUrl");return $.ajax({url:c+"/api/action/datastore_search",data:b}).then(function(a){var b=a.result,c={};return b.records.forEach(function(a){var b=a.type.split("_")[0];c[b]||(c[b]=[]),c[b].push(a)}),c.page.forEach(function(a){var b=[],d=c.indicator.filterBy("parentID",a.id);d.forEach(function(a){var c=Dashboard.IndicatorModel.create(a);b.push(c)}),a.indicators=b}),c.annex.forEach(function(a){var b=c.page.filterBy("parentID",a.id),d=[];b.forEach(function(a){var b=Dashboard.PageModel.create(a);d.push(b)}),a.pages=d}),c.annex})},findAll:function(){var a=Dashboard.get("settings").get("ckanUrl"),a=Dashboard.get("settings").get("ckanUrl");return $.ajax({url:a+"/api/action/datastore_search",data:data}).then(function(a){var b=a.result,c={};b.records.forEach(function(a){var b=a.type.split("_")[0];c[b]||(c[b]=[]),c[b].push(a)}),c.page.forEach(function(a){var b=[],d=c.indicator.filterBy("parentID",a.id);d.forEach(function(a){var c=Dashboard.IndicatorModel.create(a);b.push(c)}),a.indicators=b}),c.annex.forEach(function(a){var b=c.page.filterBy("parentID",a.id),d=[];b.forEach(function(a){var b=Dashboard.PageModel.create(a);d.push(b)}),a.pages=d});var d=Dashboard.ReportModel.create({title:"Board Report January 2015",annexes:c.annex});return d})}})}(),function(){Dashboard.WidgetModel=Ember.Object.extend({_data:null,data:function(){if(null!=this.get("_data"))return this.get("_data");switch(this.get("type")){case"NHSIndicator":return null===this.get("indicatorID")?new Error("No indicator id for Widget > NHSIndicator "):(this.set("_data",Dashboard.IndicatorModel.create({id:this.get("indicatorID")})),this.get("_data"))}}.property("_data")}),Dashboard.WidgetModel.reopenClass({})}(),function(){Dashboard.AnnexRoute=Ember.Route.extend({model:function(a){var b=a.annexID,c=this.modelFor("dash"),d=c.get("ckanResourceID");if(null!=d){var e=Dashboard.ReportModel.find(d).then(function(a){return a.findBy("id",b)});return e}}})}(),function(){Dashboard.AuthenticatedRoute=Ember.Route.extend({hasPermission:!1,model:function(){if("undefined"==typeof ignoreAuth||ignoreAuth===!0||this.get("hasPermission"))return!0;if(null==isLoggedIn||isLoggedIn===!1)this.transitionTo("login");else{var a=this,b=Dashboard.get("settings").get("ckanUrl"),c=Dashboard.get("settings").get("directoryID");Ember.$.ajax({url:b+"/api/action/resource_show?id="+c}).error(function(b){return 403!==b.status?(a.set("hasPermission","true"),!0):(a.set("hasPermission",!1),void a.transitionTo("permissions"))}).success(function(){return a.set("hasPermission","true"),!0})}return!0}})}(),function(){Dashboard.DashRoute=Dashboard.AuthenticatedRoute.extend({model:function(a){this._super();var b=a.dashID;return Dashboard.DashboardModel.find(b)},afterModel:function(){var a=this;a.renderTemplate=function(){var b=a.currentModel;if(null!=b){var c=b.type.decamelize();a.render(c,{model:b});var d=this.controllerFor("header");d.set("model",b),a.render("header_"+c,{into:"application",outlet:"header",view:"header",controller:d,model:b})}}},activate:function(){this.renderTemplate()},_modal:null,_modalActive:!1,actions:{toggleFooter:function(a){this.toggleFooter(a)},openModal:function(a){return this.render(a,{into:"application",outlet:"modal",view:a})},closeModal:function(){return this.disconnectOutlet({outlet:"modal",parentView:"application"})}},toggleFooter:function(a){return this.render(a,{into:"application",outlet:"footer"})}})}(),function(){Dashboard.IndexRoute=Ember.Route.extend({model:function(){return Dashboard.DashboardModel.findAll()},afterModel:function(a){null!=a&&void 0!=a&&a.get("length")>0&&this.replaceWith("dash",a.get("lastObject").get("id"))}})}(),function(){Dashboard.PageRoute=Dashboard.AuthenticatedRoute.extend({dashID:null,annexID:null,pageID:null,model:function(a){this._super();var b=a.dashID,c=a.annexID,d=a.pageID;this.set("dashID",b),this.set("annexID",c),this.set("pageID",d);var e=this.modelFor("dash");if(null==e)return Dashboard.DashboardModel.find(b).then(function(a){var b=a.get("ckanResourceID");return null!=b?Dashboard.ReportModel.find(b).then(function(a){var b=a.findBy("id",c).pages.findBy("id",d);return"page_summary"===b.get("type")&&b.set("ragPages",a.findBy("id","annex_b").pages),b}):void 0});var f=e.get("ckanResourceID");if(null!=f){var g=Dashboard.ReportModel.find(f).then(function(a){var b=a.findBy("id",c).pages.findBy("id",d);return"page_summary"===b.get("type")&&b.set("ragPages",a.findBy("id","annex_b").pages),b});return g}},activate:function(){null!=this.currentModel&&this.renderTemplate()},afterModel:function(){var a=this;a.renderTemplate=function(){var b=a.currentModel;b.setProperties({dashID:this.get("dashID"),annexID:this.get("annexID"),pageID:this.get("pageID")}),a.render(b.type,{outlet:"",into:"application",model:b});var c=a.controllerFor("header");c.set("model",b),a.render("header_board_report_page",{into:"application",outlet:"header",view:"header",controller:c,model:b})}},setupController:function(a,b){a.set("model",b)}})}(),function(){Dashboard.BoardReportPickerComponent=Ember.Component.extend({needs:"dashboard",dashboard:Ember.computed.alias("controllers.dashboard"),classNames:["chooseBoardReport"],classNameBindings:["isActive"],isActive:!1,_reports:null,reports:function(){if(null!=this.get("_reports"))return this.get("_reports");var a=this;Dashboard.DashboardModel.findAll().then(function(b){var c=b.filterBy("type","BoardReport");return a.set("_reports",c),b})}.property("_reports")})}(),function(){Dashboard.BusinessAreaRowComponent=Ember.Component.extend({needs:"dashboard",dashboard:Ember.computed.alias("controllers.dashboard"),commentDecoded:function(){var a=this.get("row.comment");return a=a.toString().fixChars()}.property("row.comment")})}(),function(){Dashboard.ChartLineSeriesComponent=Ember.Component.extend({isDrawn:!1,draw:function(a){var b="#"+a.get("chartID"),c=a.get("valueString"),d=a.get("_dataValues"),e=0,f=0,g=Math.max.apply(d,$.map(d,function(a){return a.get("val")}));f=g;var h=parseFloat(a.get("targetVal"));if("%"===c){var i=Math.min.apply(d,$.map(d,function(a){return a._val}));i>h&&(i=h),h>g&&(g=h),i-=1,g+=2,f=g,e=i}var j=d.map(function(a){var b=-1===a.start_date.indexOf("T")?a.start_date:a.start_date.substr(0,a.start_date.indexOf("T"));return b}),k=d.map(function(a){var b=a.get("val");return b}),l="%"===a.get("valueType")?"Percentage":"Value",m=[];if("Constitutional"===a.get("ragType")){var n=h+.0099,o=h+.01,p=.3;m="%"===c?[{axis:"y",start:0,end:h,"class":"regionYR",opacity:p},{axis:"y",start:h,end:n,"class":"regionYA",opacity:p},{axis:"y",start:o,"class":"regionYG",opacity:p}]:[{axis:"y",start:0,end:h,"class":"regionYG",opacity:p},{axis:"y",start:h,"class":"regionYR",opacity:p}]}j.unshift("x"),k.unshift("Indicator Value"),c3.generate({bindto:b,legend:{hide:!0},data:{x:"x",columns:[j,k]},axis:{x:{type:"timeseries",tick:{format:"%b %Y"},label:{text:"Change over time",position:"outer-left",padding:{top:18,bottom:0}}},y:{tick:{format:function(a){return a.toString()+("%"===c?"%":"")}},min:e,max:f,padding:{top:18,bottom:0},label:{text:l+" achieved",position:"outer-bottom"}}},grid:{y:{show:!0}},point:{focus:{expand:{r:5}}},padding:{right:20},regions:m}),d3.select(".c3-axis.c3-axis-x").attr("clip-path",""),this.set("isDrawn",!0),d3.selectAll(".c3-axis-x-label").attr("y","2.5em")},didInsertElement:function(){var a=this.get("controller.data"),b="#"+a.get("chartID"),c=$(b),d=c.parents(".accordionContent"),e=d.parent().siblings('.row[data-indicator-id="'+a.get("id")+'"]'),f=this;e.click(function(){f.get("isDrawn")||setTimeout(function(){f.draw(a)},1e3)})}})}(),function(){Dashboard.HeaderLogoComponent=Ember.Component.extend({})}(),function(){Dashboard.IndicatorRowChartComponent=Ember.Component.extend({showChart:function(){var a=this.get("model");return null!=a&&null!=a.get("currentValue")&&null!=a.get("previousValue")}.property("model.currentValue","model.previousValue")})}(),function(){Dashboard.ModalDialogComponent=Ember.Component.extend({didInsertElement:function(){this.get("parentIsView")===!0&&this.set("targetObject",this.get("parentView"))},actions:{close:function(){return console.log("ModalDialogComponent > Close"),this.sendAction()}}})}(),function(){Dashboard.WidgetBoardReportIndicatorComponent=Ember.Component.extend({needs:"dashboard",dashboard:Ember.computed.alias("controllers.dashboard"),widget:null,indicator:null,chartModal:null,didInsertElement:function(){var a=this.get("controller.widget");this.set("widget",a)},actions:{toggleGraph:function(){this.displayGraphPopup()},toggleMeta:function(){this.displayMeta(),this.sendAction("action","Testy McTest test")},openModal:function(a,b){this.sendAction("action",a,b)}},displayFlip:function(){},displayMeta:function(){var a=null,b=this.$(),c=b.parents(".dashboard");if(null==this.get("chartModal")){var d=$('<div class="chartModal" id="'+this.get("widget.id")+'"></div>');a=d.appendTo(c),b.addClass("modalHighlighted"),this.set("chartModal",a)}else{var e=$(".chartModal:visible");e.length>0?e.first().attr("id")===this.get("widget.id")?e.fadeOut("fast"):(a=this.get("chartModal"),e.fadeOut("fast",function(){a.fadeIn("fast")})):this.get("chartModal").fadeIn("fast")}},displayGraphPopup:function(){if(null==this.get("chartModal")){var a=$('<div class="chartModal"><h2>THIS IS THE CHART: '+this.get("widget.indicatorID")+"</h2></div>");this.set("chartModal",a.appendTo(this.$().parents(".dashboard"))),this.populateChart()}$(".chartModal:visible").length>0?$(".chartModal:visible").fadeOut("fast",function(){this.get("chartModal").fadeToggle("fast")}):this.get("chartModal").fadeToggle("fast")},populateChart:function(){Dashboard.HeatMapComponent.create({data:this.get("widget")}).appendTo(this.get("chartModal"))}})}(),function(){Dashboard.ApplicationView=Ember.View.extend({})}(),function(){Dashboard.BoardReportView=Ember.View.extend({templateName:"dashboard_BoardReport",didInsertElement:function(){}})}(),function(){Dashboard.BoardReportDashboardView=Ember.View.extend({templateName:"dashboard_Dashboard",didInsertElement:function(){var a=this;Ember.run.schedule("afterRender",function(){a.modelChanged()})},modelChanged:function(){if(this.$()){var a=this.get("controller.model");null!=a.get("data")&&Ember.run.schedule("afterRender",function(){dashWrapper.initGridster()})}}.observes("controller.model.data.@each")})}(),function(){Dashboard.DashboardView=Ember.View.extend({templateName:"dashboard_Dashboard",didInsertElement:function(){var a=this;Ember.run.schedule("afterRender",function(){a.modelChanged()})},modelChanged:function(){if(this.$()){var a=this.get("controller.model");null!=a.get("data")&&Ember.run.schedule("afterRender",function(){dashWrapper.initGridster()})}}.observes("controller.model.data.@each")})}(),function(){Dashboard.HeaderView=Ember.View.extend({owlCarousel:null,_templateName:"header_standard"})}(),function(){Dashboard.IndexView=Ember.View.extend({templateName:"index",owl:null})}(),function(){Dashboard.WidgetMetaView=Ember.View.extend({templateName:"widget_meta",actions:{close:function(){this.get("controller").send("closeModal")}}})}(),function(){Dashboard.Router.map(function(){this.resource("dash",{path:"/:dashID"}),this.resource("page",{path:"/:dashID/:annexID/:pageID"}),this.route("permissions"),this.route("login")}),Dashboard.Router.reopen({rootURL:"/",init:function(){var a=window.location.pathname.match("[^/]*/[^/]*");null!==a&&a.length>0&&this.set("rootURL",a[0]),this._super()}})}(),function(){Ember.View.reopen({didInsertElement:function(){this._super(),Ember.run.scheduleOnce("afterRender",this,this.afterRenderEvent)},afterRenderEvent:function(){}})}();
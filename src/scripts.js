var map;
var view;
require(["esri/Map", "esri/views/SceneView","esri/layers/FeatureLayer",
"esri/config","esri/widgets/LayerList","esri/widgets/BasemapGallery",
"esri/widgets/Home","esri/widgets/Search","esri/widgets/Expand","esri/widgets/Legend"], (Map, SceneView,FeatureLayer,esriConfig,
  LayerList,BasemapGallery,Home,Search,Expand,Legend,Popup) => {
    map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation",
      opacity: 0.4
    });
    esriConfig.apiKey = "AAPK6335266679a2469cb471ac8846e1a513Mwx7s6fC5meYUmG742r1c195XZjWO7m6wCciK6Oxf57oXmmRupWYG61c7HMMIzkw"; 
      view = new SceneView({
      container: "viewDiv",
      map: map,
      scale: 20000000,
      center: [10, 50]
    });

    // Define a pop-up for Susceptibility
    const popupsusceptibility = {
      "title": "Susceptibility",
      "content": "<b>Mountain domain:</b> {Zone}<br><b>Area Slopeunit:</b> {Area_SU}<br><b>Susceptibility:</b> {susc_unb}"
    }
    
    const exposure = {
      "title": "Landslide Risk- Expected Losses",
      "content": "<b>Mountain domain:</b> {Zone}<br><b>Area Slopeunit:</b> {Area_SU}<br><b>Susceptibility:</b> {susc_unb}<br><b>Human settlementes exposure (€):</b> {Bui_exp}<br><b>Agricultural areas exposure (€):</b> {Lu_exp}<br><b>Total risk - expected economic losses (€):</b> {Risk_tot}<br><b>Total risk per square meter (€/square meter):</b> {Rtot_sqm}"
    }
    const hazardlayer = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Landslide_susceptibility/FeatureServer",
      visible: false,
      title: "Hazard",
      popupTemplate: popupsusceptibility
    });
  
    view.map.add(hazardlayer);

    const losslayer = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Landslide_risk_expected_losses/FeatureServer",
      visible: false,
      title:"Loss",
      popupTemplate: exposure
    });
  
    view.map.add(losslayer);

    const risklayer = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Landslide_risk_hotspots/FeatureServer",
      visible: false,
      title:"Risk (Susceptibility vs Human settlementes exposure)"
    });
  
    view.map.add(risklayer);

    const risklayerday = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Yearly_population_at_risk_Daytime/FeatureServer",
      visible: false,
      title:"RiskDay (Susceptibility vs Yearly Population Daytime)"
    });
  
    view.map.add(risklayerday);

    const risklayernight = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Yearly_population_at_risk_Nighttime/FeatureServer",
      visible: false,
      title:"RiskNight (Susceptibility vs Yearly Population Nighttime)"
    });
  
    view.map.add(risklayernight);

    const risklayerdiff = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Yearly_population_at_risk_differences/FeatureServer",
      visible: false,
      title:"RiskDiff (Susceptibility vs Differences in Yearly Population)"
    });
  
    view.map.add(risklayerdiff);

    view.when(() => {
      const llExpand = new Expand({
        view,
        content: new LayerList({view}),
        expandIcon: "layers"
      });

      // Add widget to the top right corner of the view
    view.ui.add(llExpand, "top-left");});


    // add functionality
    const scExpand = new Expand({
      view,
      content: new Search({view}),
      expandIcon: "search"
    });
    view.ui.add(scExpand, "top-left");

    let homeWidget = new Home({
      view: view
    });
    // adds the home widget to the top left corner of the MapView
    view.ui.add(homeWidget, "top-left");


    const bgExpand = new Expand({
      view,
      content: new BasemapGallery({ view }),
      expandIcon: "basemap"
    });
    view.ui.add(bgExpand, "top-left");

    view.when(() => {
      const lgExpand = new Expand({
        view,
        content: new Legend({view}),
        expandIcon: "legend",
        expanded: true
      });

      // Add widget to the top right corner of the view
    view.ui.add(lgExpand, "bottom-right");});
    view.popup.autoOpenEnabled = true;
    view.popup.dockEnabled = true;
    // view.when(() => {
    //   view.map.basemap = "navigation-3d";
    //   });
 
  });

  function loadhaz(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=true;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk (Susceptibility vs Human settlementes exposure)";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay (Susceptibility vs Yearly Population Daytime)";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight (Susceptibility vs Yearly Population Nighttime)";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff (Susceptibility vs Differences in Yearly Population)";
            }).visible=false;
    document.getElementById("detailtext").textContent="The hazard component is considered as the only spatial probability of occurrence of landslides (Susceptibility). The susceptibility map shows the probability of landsliding for each mapping unit (Slope Unit). The scores range from 0 (non-susceptible conditions) to 1 (prone to failure).";
  };

  function loadloss(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=true;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk (Susceptibility vs Human settlementes exposure)";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay (Susceptibility vs Yearly Population Daytime)";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight (Susceptibility vs Yearly Population Nighttime)";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff (Susceptibility vs Differences in Yearly Population)";
            }).visible=false;
    document.getElementById("detailtext").textContent="The landslide-induced risk reports the possible economic consequences to human settlements and agricultural areas across the European landscape. The expected economic losses are computed by combining the susceptibility, the vulnerability, and exposure of exposed elements. The vulnerability is set equal to 1 (maximum degree of loss), in the occurrence of a landslide, any structure and element in its path will suffer irreparable damage. Expected losses (€/square meter) are displayed on a logarithmic scale. ";
  };

  function loadrisk(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk (Susceptibility vs Human settlementes exposure)";
      }).visible=true;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay (Susceptibility vs Yearly Population Daytime)";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight (Susceptibility vs Yearly Population Nighttime)";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff (Susceptibility vs Differences in Yearly Population)";
            }).visible=false;
    document.getElementById("detailtext").textContent=" Risk - Hotspots. The map shows the spatial distribution of landslide susceptibility (red colors) and human settlement exposure (blue colors) by means of a bivariate color scheme. This visualization aims to compare and emphasize quantitatively the relationship between these two components.";
  };
  function loadriskday(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk (Susceptibility vs Human settlementes exposure)";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay (Susceptibility vs Yearly Population Daytime)";
        }).visible=true;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight (Susceptibility vs Yearly Population Nighttime)";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff (Susceptibility vs Differences in Yearly Population)";
            }).visible=false;
    document.getElementById("detailtext").textContent="Yearly population at risk during daytime. The map shows the spatial distribution of landslide susceptibility and yearly population density during daytime through a bivariate scheme. Slope units without inhabitants are not displayed.";
  };
  function loadrisknight(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk (Susceptibility vs Human settlementes exposure)";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay (Susceptibility vs Yearly Population Daytime)";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight (Susceptibility vs Yearly Population Nighttime)";
          }).visible=true;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff (Susceptibility vs Differences in Yearly Population)";
            }).visible=false;
    document.getElementById("detailtext").textContent=" Yearly population at risk during nighttime. The map shows the spatial distribution of landslide susceptibility and yearly population density during nighttime through a bivariate scheme. Slope units without inhabitants are not displayed.";
  };
  function loadriskdifference(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk (Susceptibility vs Human settlementes exposure)";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay (Susceptibility vs Yearly Population Daytime)";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight (Susceptibility vs Yearly Population Nighttime)";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff (Susceptibility vs Differences in Yearly Population)";
            }).visible=true;
    document.getElementById("detailtext").textContent=" The map shows the spatial distribution between landslide susceptibility and differences during daytime and nighttime in the yearly population. Red colors indicate mapping units where the population of nighttime is greater than the one of daytime. The green colors display the opposite case. Colors from grey to white are related to mapping units where there is no differences between the two day cycles.";
  };

// function loadhaz(){
//   require([
//     "esri/layers/FeatureLayer",
//   ],(FeatureLayer) => {
//     view.map.removeAll();
//     const hazardlayer = new FeatureLayer({
//       url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Susc_Europe/FeatureServer"
//     });
  
//     view.map.add(hazardlayer);
//     view.when(() => {
//       const layerList = new LayerList({
//         view: view
//       });

//       // Add widget to the top right corner of the view
//       view.ui.add(layerList, "bottom-right");});
//   });
// };

// function loadloss(){
//   require([
//     "esri/layers/FeatureLayer",
//   ],(FeatureLayer) => {
//     view.map.removeAll();
//     const losslayer = new FeatureLayer({
//       url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Risk_Losses/FeatureServer"
//     });
  
//     view.map.add(losslayer);
//     view.when(() => {
//       const layerList = new LayerList({
//         view: view
//       });

//       // Add widget to the top right corner of the view
//       view.ui.add(layerList, "bottom-right");});
//   });
// };

// function loadrisk(){
//   require([
//     "esri/layers/FeatureLayer","esri/widgets/LayerList"
//   ],(FeatureLayer,LayerList) => {
//     view.map.removeAll();
//     const risklayer = new FeatureLayer({
//       url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Risk_Hotspots/FeatureServer"
//     });
  
//     view.map.add(risklayer);
//     view.when(() => {
//       const layerList = new LayerList({
//         view: view
//       });

//       // Add widget to the top right corner of the view
//       view.ui.add(layerList, "bottom-right");});
//   });
// };

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
      title:"Risk"
    });
  
    view.map.add(risklayer);

    const risklayerday = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Yearly_population_at_risk_Daytime/FeatureServer",
      visible: false,
      title:"RiskDay"
    });
  
    view.map.add(risklayerday);

    const risklayernight = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Yearly_population_at_risk_Nighttime/FeatureServer",
      visible: false,
      title:"RiskNight"
    });
  
    view.map.add(risklayernight);

    const risklayerdiff = new FeatureLayer({
      url: "https://services6.arcgis.com/rbb2iNgQKjXE64T8/arcgis/rest/services/Yearly_population_at_risk_differences/FeatureServer",
      visible: false,
      title:"RiskDiff"
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
      return layer.title === "Risk";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff";
            }).visible=false;
    document.getElementById("detailtext").textContent="The hazard component was considered as the only spatial probability of occurrence of landslides, commonly named Susceptibility. The susceptibility map shows the likelihood of a landslide occurrence for each Slope Unit (SU) pertaining to the European mountain ranges through a scale ranging from 0 (no landslide) to 1 (unstable SU).";
  };

  function loadloss(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=true;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff";
            }).visible=false;
    document.getElementById("detailtext").textContent="The landslide-induced risk reports the possible economic consequences to human settlements and agricultural areas across the European landscape The expected economic losses were computed by combining the spatial probability of landslide occurrence, the vulnerability, and exposure of exposed elements The vulnerability was set equal to 1 (maximum degree of loss), in the occurrence of a landslide, any structure and element in its path will suffer irreparable damage. The expected losses are expressed as a function of Slope Units extension and reported as euros per square meter. ";
  };

  function loadrisk(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk";
      }).visible=true;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff";
            }).visible=false;
    document.getElementById("detailtext").textContent="The Hotspots of landslide risk across the European mountain ranges are expressed through a quantitative bivariate map. This map visually elucidates the intricate spatial interplay between two fundamental constituents of the risk assessment equation: the Hazard component, which encapsulates Susceptibility, and the Exposure component.";
  };
  function loadriskday(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay";
        }).visible=true;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff";
            }).visible=false;
    document.getElementById("detailtext").textContent="Yearly population at risk during daytime. The map shows the spatial distribution of landslide susceptibility and yearly population density during daytime through a bivariate scheme.";
  };
  function loadrisknight(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight";
          }).visible=true;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff";
            }).visible=false;
    document.getElementById("detailtext").textContent=" Yearly population at risk during nighttime. The map shows the spatial distribution of landslide susceptibility and yearly population density during nighttime through a bivariate scheme.";
  };
  function loadriskdifference(){
    view.map.allLayers.find(function(layer) {
      return layer.title === "Hazard";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "Loss";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
      return layer.title === "Risk";
      }).visible=false;
    view.map.allLayers.find(function(layer) {
        return layer.title === "RiskDay";
        }).visible=false;
    view.map.allLayers.find(function(layer) {
          return layer.title === "RiskNight";
          }).visible=false;
    view.map.allLayers.find(function(layer) {
            return layer.title === "RiskDiff";
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

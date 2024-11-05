
setwd("")#set the workin directory

####### Packages #####

packages = c('mgcv', 'ggplot2', 'dplyr', 'parallel', 'tidyr', 'pROC')

installed_packages = packages %in% rownames(installed.packages())
if (any(installed_packages == FALSE)) {
  install.packages(packages[!installed_packages])
}

invisible(lapply(packages, library, character.only = TRUE))

####### Input data #####
load("data_input/data.Rda")
data_fit=data[data$Inventory==1,] #data for model fit

####### Pre processing #####
data_fit$zones=as.factor(data_fit$Country)
data_fit$Litho=as.factor(data_fit$litho)

data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones), "Malta"))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones), "Faroe Islands"))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones), "Isle of Man"))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Russian Federation'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Finland'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Poland'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Ukraine'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Moldova, Republic of'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Serbia'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Gibraltar'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Albania'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Belgium'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Bosnia & Herzegovina'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Bulgaria'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Croatia'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Cyprus'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Hungary'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Luxembourg'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Montenegro'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'The former Yugoslav Republic of Macedonia'))
data_fit$zones <- factor(data_fit$zones, levels = c(levels(data_fit$zones),'Turkey'))

####### Model fit #######
ctrl =list(nthreads=144)
formula=landslide~s(infra_len,k=3)+s(zones,bs="re")+s(dis_aFault,k=5)+s(Litho,bs="re")+s(lu_change,k=5)+
  s(ndvi_mean,k=5)+s(rnsum_mean,k=5)+s(slope_mean,k=5)+s(slope_std,k=5)+north_mean + east_mean + 
  s(prof_mean,k=5)+s(plan_mean,k=5)
model=mgcv::bam(formula,family="binomial",method="fREML",data=data_fit,select=TRUE,control=ctrl,discrete=50,drop.unused.levels = F)

#saveRDS(model, "GAMmodel.rds") #uncomment if you would like to save your own model
model=readRDS("GAMmodel.rds") #comment if you want to plot your own model
plot(model,shade=T,shade.col='#A6D3A0',ylab='Susceptibility',ylim=c(0,1),trans=plogis)

##### Performance of reference model #####

pre_biased=predict.bam(model,data_fit,type="response")
roc_biased=roc(data_fit$landslide,pre_biased)

myexclude=c("s(infra_len)","s(zones)")
pre_unbiased=predict.bam(model,data_fit,type="response",exclude=myexclude)
roc_unbiased=roc(data_fit$landslide,pre_unbiased)


plot(roc_biased,print.auc=FALSE,col='red')
plot(roc_unbiased,print.auc=FALSE,col='blue',add=TRUE)
legend("bottomright",legend=c(paste ("biased:", round(roc_biased$auc,2)),
                              paste("unbiased:",round(roc_unbiased$auc,2))),
                              col=c("red","blue"),lty=c(1,1),cex=0.7)






       
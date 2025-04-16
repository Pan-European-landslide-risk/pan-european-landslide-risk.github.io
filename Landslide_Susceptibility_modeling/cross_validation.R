setwd("")# set the working directory

####### Packages #####
packages = c('mgcv','dplyr', 'parallel','sperrorest')
installed_packages = packages %in% rownames(installed.packages())
if (any(installed_packages == FALSE)) {
  install.packages(packages[!installed_packages])
}

invisible(lapply(packages, library, character.only = TRUE))

####### Input data #######
load("data_input/data.Rda")

ctrl =list(nthreads=144)
formula=landslide~s(infra_len,k=3)+s(zones,bs="re")+s(dis_aFault,k=5)+s(Litho,bs="re")+s(lu_change,k=5)+
  s(ndvi_mean,k=5)+s(rnsum_mean,k=5)+s(slope_mean,k=5)+s(slope_std,k=5)+north_mean + east_mean + 
  s(prof_mean,k=5)+s(plan_mean,k=5)

myexclude=c("s(infra_len)","s(zones)")

data_val=data[data$Inventory==1,] #suitable data for validation

####### Pre processing #####
data_val$zones=as.factor(data_val$Country)
data_val$Litho=as.factor(data_val$litho)
data_val$plan_max[data_val$plan_max > 15] = 15
data_val$prof_mean[data_val$prof_mean< -0.0018] = -0.0018
data_val$prof_mean[data_val$prof_mean> 0.0012] = 0.0012
data_val$dis_aFault[data_val$dis_aFault>2500]=2500


data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones), "Malta"))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones), "Faroe Islands"))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones), "Isle of Man"))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Russian Federation'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Finland'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Poland'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Ukraine'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Moldova, Republic of'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Serbia'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Gibraltar'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Albania'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Belgium'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Bosnia & Herzegovina'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Bulgaria'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Croatia'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Cyprus'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Hungary'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Luxembourg'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Montenegro'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'The former Yugoslav Republic of Macedonia'))
data_val$zones <- factor(data_val$zones, levels = c(levels(data_val$zones),'Turkey'))


####### RCV #######

k=10
set.seed(1)
folds=sample(1:k,nrow(data_val),replace=TRUE)
auc_rcv=rep(0,10)
auc_rcv.b=rep(0,10)
for (j in 1:k){
  model=mgcv::bam(formula,family="binomial",method="fREML",data=data_val[folds!=j,],select=TRUE,control=ctrl,
                  discrete=50,drop.unused.levels = F)
  predict=predict.bam(model,data_val[folds==j,],type="response",exclude=myexclude)
  predict.b=predict.bam(model,data_val[folds==j,],type="response")
  auc_rcv[j]=auc(data_val$landslide[folds==j],predict)
  auc_rcv.b[j]=auc(data_val$landslide[folds==j],predict.b)
}
save(auc_rcv,file='data_output/cross_validation/RCV/auc_rcv.Rda')
save(auc_rcv.b,file='data_output/cross_validation/RCV/auc_rcvBIAS.Rda')



####### Domain-oriented CV #######

area=sample(unique(data_val$Zone))
auc_domain=rep(0,13)
auc_domain.b=rep(0,13)
for (j in area){
  model=mgcv::bam(formula,family="binomial",method="fREML",data=data_val[area!=j,],select=TRUE,control=ctrl,
                  discrete=50,drop.unused.levels = F)
  predict=predict.bam(model,data_val[area==j,],type="response",exclude=myexclude)
  predict.b=predict.bam(model,data_val[area==j,],type="response")
  auc_domain[j]=auc(data_val$landslide[area==j],predict)
  auc_domain.b[j]=auc(data_val$landslide[area==j],predict.b)
}
auc_domain2=auc_domain[14:26]
auc_domain2.b=auc_domain.b[14:26]
save(auc_domain2,file='data_output/cross_validation/Domain_oriented_CV/auc_domain.Rda')
save(auc_domain2.b,file='data_output/cross_validation/Domain_oriented_CV/auc_domainBIAS.Rda')

#######  SCV #######
partition=partition_kmeans(data=data_val,coords=c("x","y"),nfold=10,repetition =10)
save(partition,file='data_output/cross_validation/SCV/partition_sperro.Rda')
auc_scv=rep(NA,100)
auc_scv.b=rep(NA,100)
for (rep in 1:10) {
  for (fold in 1:10) {
    cat(rep,fold)
    part=partition[[rep]][[fold]]
    data_val_data <- data_val[part$data_val, ]
    test_data <- data_val[part$test, ]
    model=mgcv::bam(formula,family="binomial",method="fREML",
                    data=data_val_data,select=TRUE,control=ctrl,discrete=50,drop.unused.levels = F)
    predict=predict.bam(model,test_data,type="response",exclude=myexclude)
    predict.b=predict.bam(model,test_data,type="response")
    auc_scv[(rep - 1) * 10 + fold] <- auc(test_data$landslide, predict)
    auc_scv.b[(rep - 1) * 10 + fold] <- auc(test_data$landslide, predict.b)
  }
}

save(auc_scv,file='data_output/cross_validation/SCV/auc_scv.Rda')
save(auc_scv.b,file='data_output/cross_validation/SCV/auc_scvBIAS.Rda')


############ BOXPLOTS ############

load('data_output/cross_validation/RCV/auc_rcv.Rda')
load('data_output/cross_validation/RCV/auc_rcvBIAS.Rda')
load('data_output/cross_validation/Domain_oriented_CV/auc_domain.Rda')
load('data_output/cross_validation/Domain_oriented_CV/auc_domainBIAS.Rda')
load('data_output/cross_validation/SCV/auc_scv.Rda')
load('data_output/cross_validation/SCV/auc_scvBIAS.Rda')

aucs=list(round(auc_rcv,digit=3),round(auc_rcv.b,digits=3)
          ,round(auc_domain2,digits=3),round(auc_domain2.b,digits=3),round(auc_scv,digits=3)
          ,round(auc_scv.b,digits=3))
for (i in aucs){
  round(i,digits=2)}


boxplot(aucs,names=c('RCV','RCV Bias','domain-CV','domain-CV Bias','SCV','SCV Bias'),
        ylab='AUROC',ylim=c(0.75,0.93),
        col=c("green2","red2","green2","red2","green2","red2"))




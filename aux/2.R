#   selecting variables from VDem 7.1

code_dir <- getwd()
data_dir <- gsub('Tiles/aux', 'mokken/data', code_dir)
vdem_dir <- gsub('mokken/data$', 'Sequencing Methods/Polyarchy/data', data_dir)

setwd(vdem_dir)
mega <- readRDS('DS-CY-v7.1.rds')
setwd(data_dir)
d <- readRDS('data.rds')
e <- read.csv('polyarchy_components_with_episodes_jan2018.csv')
setwd(code_dir)


e <- e[, colnames(e)!='v2mecenefi_ord']

ord_vars <- names(e)[5:27]
osp_vars <- gsub('ord$', 'osp', ord_vars)

names(mega)[grep('suffr', names(mega))]

apply(mega[,grep('suffr', names(mega))], 2, 
      function(x) round(mean(is.na(x))*1e2))


summary(mega[,grep('suffr', names(mega))])

osp_vars[grep('suffr', osp_vars)] <- 'v2elsuffrage'

osp_vars


sd_vars <- c(gsub('osp$', 'sd', osp_vars[grep('osp', osp_vars)]), 'v2x_polyarchy_sd')

mean(sd_vars %in% colnames(mega))

#   find countries with completely missing polyarchy

l_mega <- split(mega[, c('country_name', 'year', 'v2x_polyarchy')], f=mega$country_name)


poly_na <- sapply(l_mega, function(x) mean(is.na(x[,'v2x_polyarchy'])))

summary(poly_na)

var_todo <- c('country_name', 'country_text_id', 'year', 'v2x_polyarchy', osp_vars, sd_vars)

mf <- mega[!is.na(mega$v2x_polyarchy), var_todo] 

nrow(mf)/nrow(mega)



perc_miss <- apply(mf, 2, function(x) round(mean(is.na(x))*1e2))

mf2 <- na.omit(mf[, perc_miss < 5])


nrow(mf2)/nrow(mf)
nrow(mf2)/nrow(mega)

names(mf2)

apply(mf2[, 4:ncol(mf2)], 2, summary)

mf3 <- mf2
mf3[, 'v2elsuffrage'] <- mf2[, 'v2elsuffrage']/1e2
for (i in 1:length(sd_vars)) {
    sdv <- sd_vars[i]
    if (sdv=='v2x_polyarchy_sd') {
        ospv <- 'v2x_polyarchy' 
    } else {
        ospv <- gsub('sd$', 'osp', sdv)
    }
    if (ospv%in%colnames(mf3)) {
        fact <- round(max(mf2[,ospv]))
        mf3[,ospv] <- mf2[,ospv]/fact
        mf3[,sdv] <- mf2[,sdv]/fact
    }
}


apply(mf3[, 4:ncol(mf3)], 2, summary)

sd_aux_1 <- names(mf3)[grep('sd$', names(mf3))]
sd_aux_2 <- substr(sd_aux_1, 1, nchar(sd_aux_1)-3)

sapply(sd_aux_2, function(x) length(grep(x, names(mf3))))

mf4 <- mf3
names(mf4)[names(mf4)=='v2x_polyarchy'] <- 'v2x_polyarchy_osp'
write.csv(mf4, 'vdem71selection.csv', row.names=F)


#write.csv(data.frame(var_name=colnames(mf3)), 'descriptions.csv', row.names=F)


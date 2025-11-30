

import { TabooCard, Difficulty, Language } from '../types';

const parse = (data: string): TabooCard[] => {
  return data.split('\n')
    .filter(line => line.trim().length > 0 && line.includes('|'))
    .map(line => {
      const [word, bannedString] = line.split('|');
      return {
        word: word.trim(),
        bannedWords: bannedString.split(',').map(s => s.trim())
      };
    });
};

// --- AZERBAIJANI ---
const AZ_EASY = `
Futbol|top,oyunçu,qapı,qol,komanda
Telefon|zəng,mobil,ekran,mesaj,danışıq
Maşın|sürücü,yol,təkər,mühərrik,benzin
Su|içmək,maye,şüşə,kran,təmiz
Kitab|səhifə,müəllif,oxumaq,kağız,mətn
Qələm|yazmaq,mürəkkəb,dəftər,ofis,kağız
Komputer|monitor,klaviatura,siçan,ekran,internet
Günəş|işıq,istilik,səma,parlaq,gün
Ay|gecə,səma,parıltı,dairə,kosmos
Pizza|pendir,sous,italyan,isti,dairə
Market|alış,kassir,satıcı,pul,mağaza
Məktəb|dərs,müəllim,sinif,şagird,yazmaq
Uşaq|balaca,ailə,oyun,doğmaq,məktəb
Buz|soyuq,su,dondurmaq,şəffaf,qatı
Saat|vaxt,əqrəb,dəqiqə,saniyə,divar
Evdar|ev,səliqə,qadın,iş,təmizlik
Açar|qapı,açmaq,metal,kilid,ev
Divan|oturmaq,ev,mebel,yumşaq,salon
Stol|masa,mebel,yemək,oturmaq,qab
Çörək|un,yemək,soba,isti,xəmir
Dondurma|soyuq,şirin,yay,stik,vanil
Kola|qazlı,içki,şirin,qara,soyuducu
Limun|sarı,turş,meyvə,şirə,C vitamini
Balıq|su,dəniz,üzmək,pulcuq,qida
Süd|ağ,içki,inək,kalsium,qida
Ev|otaq,qapı,pəncərə,yaşamaq,bina
Tualet|su,əl,sabun,otaq,gigiyena
Taksi|sürücü,maşın,sarı,pul,yol
Metro|qatar,yeraltı,stansiya,tunel,xətt
Park|ağac,oturacaq,gəzinti,yaşıl,uşaqlar
Musiqi|nota,mahnı,ritm,səs,ifa
Gitara|sim,musiqi,ifa,mahnı,alət
Film|kino,ekran,aktyor,səhnə,rejissor
Televizor|ekran,kanal,baxmaq,səslər,uzaqdan
Youtube|video,kanal,izləmək,internet,like
Google|axtarış,internet,sayt,nəticə,sorğu
Qatar|rels,vaqon,stansiya,yol,sürət
Paltar|geyim,bədən,mağaza,ölçü,rəng
Ayaqqabı|ayaq,cüt,geyim,ölçü,mağaza
Soda|qazlı,içki,şüşə,mağaza,soyuq
Şokolad|şirin,kakao,səhər,tünd,plitka
Meyvə|şirin,ağac,yemək,vitamin,tərəvəz
Tərəvəz|bağ,yemək,yaşıl,vitamin,bitki
Qarpız|qırmızı,yay,toxum,meyvə,şirin
Alma|meyvə,qırmızı,yaşıl,şirin,ağac
Qoyun|heyvan,yun,ot,çoban,sürü
İt|heyvan,hürmək,ev,quyruq,yem
Pişik|miyav,tük,ev,balaca,oyun
Hədiyyə|qutu,paket,vermək,ad günü,şənlik
Ad günü|yaş,tort,şenlik,hədiyyə,şam
Şokolad|şirin,kakao,yemək,konfet,plitka
Sirk|kloun,heyvan,səhnə,tamaşa,artist
Təyyarə|uçmaq,pilot,hava,aeroport,səyahət
Velosiped|pedal,təkər,sürmək,dəmir,yol
Bərbər|saç,kəsmək,makas,kişi,salon
Qəhvə|fincan,isti,içmək,qoxu,səhər
Dost|yaxın,birlikdə,insan,münasibət,etibar
Ana|ailə,qadın,qayğı,övlad,sevgi
Ata|ailə,kişi,övlad,qayğı,ev
Qardaş|ailə,oğlan,birlikdə,yaxın,bacı
Bacı|qız,ailə,birlikdə,yaxın,ev
Dərman|aptek,xəstə,içmək,tablet,kapsul
Xəstəxana|doktor,xəstə,palata,müayinə,tibbi
Şüşə|şəffaf,qırılmaq,içki,qab,sərt
Kamera|şəkil,video,çəkiliş,obyektiv,cihaz
Qol|bədən,əl,barmaq,sağ,sol
Ayaq|bədən,yerimək,barmaq,ayaqqabı,alt
Burn|üz,qoxu,nəfəs,üzv,soyuq
Ekran|telefon,işıq,görüntü,cihaz,monitor
Batareya|enerji,telefon,doldurmaq,cihaz,güc
`;

const AZ_MEDIUM = `
Yağış|bulud,islanmaq,hava,damcı,göy
Qar|ağ,soyuq,qış,dənə,yağmaq
Fırtına|külək,güclü,hava,səs,bulud
Soyuducu|mətbəx,soyuq,qida,saxlamaq,buz
Qazan|mətbəx,yemək,bişirmək,metal,qapaq
Sobadan|istilik,bişirmək,yemək,mətbəx,alov
Qab-qacaq|mətbəx,yemək,boşqab,qaşıq,çəngəl
Ədviyyat|duz,istiot,yemək,dad,ədəbiyyat
Konfet|şirin,uşaq,yemək,qablaşdırma,rəngli
Meydan|şəhər,insanlar,geniş,toplaşmaq,park
Tərləmək|isti,bədən,idman,su,yorğun
Qışlıq|soyuq,paltar,qalın,geyim,mövsüm
Yaylıq|parça,baş,qadın,rəng,geyim
Sükut|sakit,səs,dinmə,otaq,qulaq
Qapı zəngi|səs,basmaq,gələn,ev,düymə
Sürüşmək|ayaq,yer,yıxılmaq,buz,diqqət
Yuxu|yatmaq,gecə,göz,yorğun,çarpayı
Kabus|yuxu,qorxu,gecə,yatmaq,xəyal
Xəyal|beyin,düşünmək,ağız,təsəvvür,fikir
Səhrə|qum,isti,quraq,dəvə,geniş
Meşə|ağac,yaşıl,heyvan,quş,təbiət
Çay (içki)|isti,fincan,qara,şəkər,içmək
Çay (su)|su,axmaq,körpü,sahil,uzun
Payız|yarpaq,sarı,mövsüm,külək,ağac
Yaz|çiçək,mövsüm,isti,yaşıllıq,təbiət
Üfüq|uzaq,xətt,günəş,baxmaq,səma
Bilet|pul,kino,təyyarə,giriş,kassir
Səfər|yol,getmək,səyahət,çamadan,maşın
Çamadan|paltar,səyahət,tutacaq,qoymaq,çanta
Çətir|yağış,açmaq,tutmaq,damcı,hava
Diş fırçası|ağız,təmizləmək,səhər,diş,pasta
Diş pastası|təmizlik,ağzı,fırça,mentol,diş
Jilet|saqqal,üz,kəsmək,təraş,bıçaq
Ət|yemək,qoyun,dana,bişirmək,qida
Toyuq|quş,ət,yumurta,yemək,ağ
Bazar|satıcı,meyvə,tərəvəz,almaq,pul
Əl çantası|qadın,tutmaq,içində,pul,eşya
Fiș|elektrik,priz,kabel,qoşmaq,enerji
Pəncərə|şüşə,açmaq,ev,günəş,otaq
Pərdə|şüşə,örtmək,otaq,pəncərə,parça
Oyun konsolu|oyun,ekran,joystick,TV,cihaz
Qulaqlıq|musiqi,səs,telefon,qulaq,naqil
Mikrofon|danışmaq,səs,səhnə,studiya,mahnı
Heykəl|daş,insan,forma,şəhər,abidə
Körpü|yol,çay,keçmək,maşın,su
Şam|işıq,yanmaq,tort,alov,yumşaq
Dəniz|su,dalğa,mavi,çimərlik,balıq
Gəmi|dəniz,su,kapitan,böyük,liman
Qayıq|su,kiçik,avar,dəniz,çay
Kamera (foto)|şəkil,obyektiv,çəkiliş,cihaz,flaş
Qəzet|xəbər,kağız,oxumaq,səhifə,jurnalist
Jurnal|foto,kağız,mövzu,səhifə,xəbər
Poçt|məktub,kuryer,göndərmək,ünvan,qutu
Məktub|yazmaq,kağız,göndərmək,poçt,sətir
Şəkər|şirin,çay,ağ,qida,qənd
Bal|arı,şirin,qida,sarı,təbiət
Quş|uçmaq,qanad,səs,təbiət,tüklər
Fil|böyük,Afrika,xortum,heyvan,ağırlıq
Şir|Afrika,heyvan,yırtıcı,kişi,meşə
Qutu|karton,içində,qoymaq,qab,bağlamaq
Çörəkbişirən|çörək,soba,xəmir,isti,ev
Saat ustası|vaxt,təmir,mexanizm,dəqiqə,əqrəb
Xalça|ev,döşəmə,naxış,yumşaq,örtük
Kreslo|oturmaq,yumşaq,mebel,ev,arxa
Çiçək|ətri,rəng,gül,bağ,su
Çinar|ağac,kölgə,böyük,yarpaq,park
Gecə|qaranlıq,ay,yatmaq,saat,sükut
Səhər|günəş,oyanmaq,işıq,erkən,çay
Günorta|günəş,isti,vaxt,yemək,saat
Axşam|qaranlıq,gün,işıq,ev,vaxt
`;

const AZ_HARD = `
Xəyal|düşüncə,təsəvvür,beyin,uydurma,fantaziya
İradə|güc,qərar,davam,istək,möhkəmlik
Məğlubiyyət|uduzmaq,rəqib,nəticə,oyun,yarış
Səbir|gözləmək,dözmək,sakit olmaq,təmkin,əsəb
Qətiyyət|qərar,israr,möhkəm,dəyişməz,davranış
Sirlilik|gizli,bilinməyən,qaranlıq,məna,tapmaca
Xasiyyət|davranış,xarakter,insan,temperament,xüsusiyyət
Tərəddüd|qərarsız,düşünmək,dayanmaq,şübhə,seçim
Təsadüf|plan,səbəb,qəfil,gözlənilməz,hadisə
Əzm|çalışma,motivasiya,qərar,davam,məqsəd
İdrak|öyrənmək,beyin,düşüncə,başa düşmək,bilik
Zarafat|gülmək,yumor,məzəli,söz,komik
Məqalə|yazı,mövzu,müəllif,məlumat,qəzet
Mürəkkəb|çətin,qarışıq,anlam,çözmək,fikir
Təsdiq|qəbul,razı,bəli,sənəd,icazə
Toxunulmazlıq|toxunmaq,hüquq,qoruma,qadağa,şəxs
Yaddaş|beyin,xatırlamaq,unutmaq,məlumat,keçmiş
Fəaliyyət|iş,hərəkət,plan,proqram,proses
Şüur|beyin,düşüncə,anlama,insan,zehin
Mükafat|qazanmaq,nəticə,pul,hədiyyə,yarış
Qəribəlik|fərqli,qəribə,adət,normal,davranış
Nəticə|son,cavab,bitmək,sonda,qərar
Rəqabət|yarış,düşmən,rəqib,uduş,mübarizə
Cəsarət|qorxusuz,güclü,risk,addım,irəli
İmtina|yox,qəbullanmaq,razılaşmamaq,geri,rədd
Əhəmiyyət|vacib,önəm,lazımlı,dəyər,əsas
İzləmə|baxmaq,təqib,arxasınca,video,film
Hüzur|sakitlik,rahat,sükut,duyğu,dinclik
Əlac|çarə,çıxış,həll,dərman,problem
Təəccüb|təəccüblənmək,qəribə,sürpriz,gözləmək,şok
İcazə|razılıq,giriş,vermək,qayda,hüquq
Tərif|öymək,söz,yaxşı,danışmaq,yüksək
Səltənət|krallıq,hakimiyyət,ölkə,taxt,tarix
Əfsanə|uydurma,qədim,hekayə,xalq,nağıl
Təkamül|inkişaf,dəyişmək,zaman,növ,proses
İradəsizlik|zəiflik,qərarsız,dayanmaq,istəməmək,sarsılmaq
Əziyyət|çətinlik,ağrı,əmək,problem,narahatlıq
Tərbiyə|davranış,ailə,məktəb,öyrətmək,qayda
Nifrət|sevməmək,pis,emosional,düşmən,zidd
Fəhm|anlam,başa düşmək,dərk,bilmək,fikir
Yaradıcılıq|fikir,yeni,sənət,beyin,fantaziya
Qayğı|yardım,diqqət,qoruma,valideyn,sevgi
Səbəb|niyə,səbəb,nəticə,əlaqə,əsas
İstək|arzu,istəyirəm,xahiş,məqsəd,seçim
Axtarış|tapmaq,itirmək,internet,araşdırma,baxmaq
Səbirsizlik|gözləmək,əsəb,tez,narahat,dayanmaq
Üstünlük|fərq,daha yaxşı,seçmək,keyfiyyət,üstün
Sədaqət|dostluq,bağlılıq,xəyanət,etibar,münasibət
Təcrübə|öyrənmək,keçmiş,bacarıq,inkişaf,sınaq
Təhrif|dəyişmək,saxtalaşdırmaq,düzəliş,yanlış,çevirmək
Vərdiş|adət,təkrar,davranış,gündəlik,öyrəşmək
Düşüncəsizlik|səhv,fikir,məsuliyyət,diqqət,ehtiyatsız
Qorxu|vahimə,təhlükə,narahatlıq,qaçmaq,tünd
İnadkarlıq|israr,razılaşmamaq,dəyişməmək,fikir,mübahisə
Narazılıq|şikayət,pis,nəticə,problem,uyğun deyil
Təxribat|dağıtmaq,məqsəd,plan,pis niyyət,problem
Aldanmaq|yalan,inanmaq,səhv,aldatmaq,tələyə düşmək
Davamiyyət|ardıcıl,dayanmadan,proses,davam,sistemli
Əzmkarlıq|güc,iradə,səy,inad,çalışma
Həssaslıq|incə,duyğu,qırılmaq,reaksiya,təsir
Qənaət|az,yığmaq,pul,istifadə,xərcləmək
Xəbardarlıq|xəbər,diqqət,təhlükə,ehtiyat,xəbərdarlıq
Əbədiyyət|sonsuz,bitməz,zaman,ölməz,davamlı
Səssizlik|sakit,sükut,heç nə,eşitmək,səda
İxtisar|azaltmaq,qısaltmaq,çıxarmaq,dəyişmək,kəsmək
Əngəl|mane,qarşısını almaq,problem,dayanmaq,keçmək
İnciklik|küsmək,qırılmaq,söz,münasibət,hiss
Yükümlülük|məsuliyyət,borc,vacib,dərhal,etməli
Tərəzi|ölçü,çəki,ağır,yüngül,alət
Qüsur|səhv,problem,ayıb,zəiflik,nasazlıq
Əzizləmək|qucaqlamaq,sevgi,toxunmaq,yaxın,mehriban
Təxəyyül|təsəvvür,xəyal,uydurmaq,beyin,şəkil
Əksiklik|az,çatışmır,natamam,yetərsiz,boş
Qeyri-müəyyənlik|bilinmir,açıq deyil,seçmək,qərar,şübhə
Ziddiyyət|uyğunsuz,qarşı,fikir,problem,tərs
Təhlükə|risk,qorxu,zərər,ehtiyat,diqqət
Ataləq|hərəkətsizlik,dayanmaq,tərpənməmək,gecikmək,tənbəllik
Şübhə|inanmamaq,qərarsız,sual,tərəddüd,qaranlıq
Qəzəb|əsəbi,hirs,qışqırmaq,reaksiya,sinir
İstesna|ayrı,fərqli,xüsusi,seçmək,qayda
Gərginlik|stress,əsəb,sıxıntı,vəziyyət,narahatlıq
Təhlükəsizlik|qoruma,qayda,polis,təhlükə,qeyd
Qayğıkeşlik|yardım,diqqət,sevgi,düşünmək,himayə
Qovluq|sənəd,kompüter,saxlamaq,ad,içində
Pərdə|pəncərə,bağlamaq,ev,örtü,işıq
Tərslik|uyğun deyil,çətin,problem,alınmır,gic
Sirlilik|gizli,bilinmir,qaranlıq,tapmaca,məna
Yoxluq|yoxdur,tapa bilməmək,itki,boş,çatışmazlıq
Özünəinam|güclü,öz,bacarmaq,inam,qorxmamaq
Məsafə|uzaq,yaxın,ölçü,yol,aralıq
İddia|demək,fikir,söz,sübut,qəbul
Yanlışlıq|səhv,düzgün deyil,düzəltmək,qarışdırmaq,problem
Təəssüf|peşman,gec,səhv,kədərlənmək,fikir
Açıqlama|məlumat,demək,izah,bildirmək,səbəb
Tənqid|pis,qüsur,analiz,demək,fikir
Barışıq|dava,mübahisə,sülh,razılaşmaq,dostluq
Yaranış|başlamaq,doğmaq,meydana çıxmaq,səbəb,ilk
Nəfis|gözəl,incə,dəyərli,zövq,seçilmiş
İmtina|yox,qəbul etməmək,geri,rədd,istəməmək
Təsəlli|sakitləşdirmək,kədər,qəm,dəstək,söz
Münasibət|insanlar,əlaqə,davranış,dostluq,münasibət
Toxuculuq|parça,ip,əllə,sənət,toxumaq
İfadə|demək,söz,cümlə,fikir,bildirmək
Uğursuzluq|alınmır,səhv,məğlubiyyət,pis nəticə,problem
Şərh|demək,izah,fikir,cavab,məna
İttiham|günah,demək,şəxs,məhkəmə,sübut
Tələskənlik|tez,səbir,bitirmək,narahatlıq,gözləmək
İqlim|hava,isti,soyuq,mövsüm,şərait
Tərcümə|dil,çevirmək,mətn,izah,söz
Sadiqlik|dost,sevgi,bağlılıq,xəyanət yoxdur,inam
Müşahidə|baxmaq,diqqət,izləmək,görmək,qeydə almaq
Əzab|ağrı,problem,dərd,sıxıntı,əziyyət
Pəncərə|ev,şüşə,açmaq,otaq,divar
Çətinlik|problem,əziyyət,hərəkət,maneə,ağır
İstedad|bacarıq,təbii,qabiliyyət,üstün,inkişaf
Niyyət|plan,ürək,səbəb,gələcək,istək
Sərhəd|xətt,ölkə,keçmək,qadağa,ərazi
Fikir ayrılığı|mübahisə,razılaşmamaq,problem,iki nəfər,fikir
Ədalət|düzgünlük,qanun,hakimin işi,haqlı,ədalətli
Təhlükəli|risk,qorxu,ehtiyat,zərər,təhlükə
Möcüzə|inanılmaz,gözlənilməz,Allah,qeyri-adi,hadisə
Qeyri-adi|fərqli,özəl,normal deyil,dəyişik,maraqlı
Səmimiyyət|içdən,düzgün,yalandan uzaq,təmiz,münasibət
Tərifləmək|yaxşı,söz,öymək,dəyər,münasibət
Təxribatçı|pozmaq,plan,qarşı çıxmaq,pis niyyət,problem yaratmaq
Ruh düşgünlüyü|kədər,motivasiya yoxdur,qaranlıq,yorğun,sıxıntı
Gizlətmək|görsətməmək,gizli,qoymaq,qorumaq,saxlamaq
İcma|insanlar,birlik,qrup,yaşayış,camaat
Təxirəsalmaq|gecikdirmək,sabaha,vaxt,tənbəllik,ertələmək
Uğur|qazanmaq,nəticə,yaxşı,mükafat,sonda
Tələbat|lazımdır,ehtiyac,vacib,almaq,istəyir
Qapalılıq|içə dönük,danışmamaq,gizli,utancaq,sirr
Təkəbbür|özünü böyük bilmək,lovğa,özünə güvən çox,yuxarıdan baxmaq,qürur
Səbəblilik|niyə,ilişki,nəticə,əlaqə,ardıcıllıq
Məcazi|birbaşa deyil,söz,məna,bənzətmə,ifadə
Tərəfdarlıq|seçim,favorit,dəstək,yanında olmaq,razı
Kövrəklik|incə,qırılmaq,emosional,toxunmaq,zəiflik
Təcili|tez,vacib,indi,gecikmək olmaz,zaman
Qaranlıq|işıq yoxdur,gecə,qapalı,görünmür,kölgə
Xüsusiyyət|özəllik,fərqlilik,xarakter,cəhət,fərq
Qınamaq|demək,pis,günahlandırmaq,səhv,davranış
Zəmanət|söz,təminat,şirkət,geri qaytarmaq,məhsul
İçəriyinə baxmaq|açmaq,içində,qutu,nə var,araşdırmaq
Münasib olmaq|uyğun,lazım,yaxşı,seçmək,uyğunluq
Səxavət|vermək,yaxşılıq,kömək,pul,pay
Təsirsizlik|işləmir,dəyişmir,reaksiya yoxdur,nəticə yoxdur,gücsüz
Müraciət|yazmaq,demək,xahiş,instansiya,sorğu
Yüklənmək|ağırlıq,çətin,çox,daşımaq,məsuliyyət
Dərinlik|aşağı,su,fikir,iç,ölçü
Yekun|son,bitdi,nəticə,tamam,bağlamaq
Əlverişsiz|çətin,pis,uyğun deyil,şərait,problem
Zidd|qarşı,tərs,uyğun deyil,fikir,davranış
Köhnəlmək|vaxt,istifadə,köhnə,aşınma,dəyişik
Sıxıntı|darıxmaq,problem,çətinlik,narahat,yorğun
Aztəminat|az pul,yoxsul,ehtiyac,sosial,zəif
Söykənmək|dayaq,durmaq,arxalanmaq,dəstək,divar
Simvol|işarə,mənâ,forma,əlamət,təsvir
Səviyyə|dərəcə,ölçü,səth,inkişaf,yüksəlmək
Nümunə|misal,göstərmək,uyğun,model,oxşar
Müşkül|çətin,problem,başa düşmək,qaranlıq,ağır
İmpuls|təkan,ani,reaksiya,hərəkət,səbəb
Qızmar|isti,günəş,yanmaq,hava,yayı
Xortlamaq|dirilmək,qəbir,qorxu,gecə,ruh
Sarsıntı|titrəmək,qorxu,hadisə,zərbə,şok
Böhranın|problem,çətin,vəziyyət,çıxış,iqtisadiyyat
Uçurum|dərin,kənar,düşmək,qayalıq,təhlükə
Sözsüzlük|danışmamaq,lal,səssizlik,reaksiya,vəziyyət
Qadağa|olmaz,icazə yoxdur,qayda,dayanmaq,etmə
Tədbir|plan,görüş,tədbir,toplu,hazırlıq
Nifrət|sevməmək,düşmən,pis,hiss,qarşıdurma
Əngəllənmə|maneə,keçmək olmur,qarşısını almaq,blok,yol
Qəfil|birdən,ani,gözlənilməz,şok,dəyişiklik
Sürüklənmək|çəkmək,aparmaq,hərəkət,su,külək
Mütləq|tam,100%,dəyişməz,vacib,lazım
Yararlılıq|faydalı,işə yaramaq,istifadə,uyğun,dəyər
Zərbə|vurmaq,güc,səs,ağrı,hərəkət
Uğursuz|alınmır,pis nəticə,şanssız,məğlub,səhv
Fırlanmaq|dönmək,çevrilmək,dairə,hərəkət,baş
Əlçatmaz|uzaq,mümkün deyil,çətin,toxunmaq olmur,əldə edilmir
Yoxlama|test,baxmaq,problem,düz,səhv
Tıxac|yol,maşın,dayanmaq,hərəkətsizlik,gözləmək
Girişim|cəhd,addım,plan,ideya,başlamaq
Yanğın|alov,istilik,tüstü,təhlükə,su
Şüalanma|işıq,enerji,yayılmaq,isti,mənbə
Xəbərsiz|bilmir,xəbər yoxdur,əlaqə yoxdur,heç kəs,tapmaq
Mükəmməllik|ideal,səhvsiz,yüksək,ən yaxşı,tam
Sıxışdırmaq|basmaq,dar,yer,itələmək,çətinlik
Mühafizə|qoruma,təhlükə,saxlamaq,polis,qayda
Qidasızlıq|aclıq,yemək,zəiflik,enerji,xəstəlik
Sürətləndirmək|tez,artırmaq,hərəkət,vaxt,davam
İltizam|söz,məsuliyyət,öhdəlik,ciddilik,qərar
Hiylə|aldadıcı,plan,oyun,uydurma,məqsəd
Yadplanetli|kosmos,dünya deyil,varlıq,təsvir,film
İzlənilmə|təqib,kamerа,baxmaq,arxadan,nəzarət
Sürüşmək|yerdə,ayaq,isti-soyuq,tərpənmək,düşmək
Tənhalıq|tək,insan yoxdur,hiss,qaranlıq,kədər
Qarışdırmaq|səhv,düzgün deyil,qatmaq,çətin,fikir
Birləşmə|qoşulmaq,birlik,iç-içə,qulaq,yığmaq
Yuxusuzluq|yatmaq olmur,gecə,yorğun,göz,problem
Sürpriz|gözlənilməz,hədiyyə,təəccüb,hazırlıq,sevindirmək
İnadla|israr,təkrar,dayanmaq,razılaşmamaq,qəti
Sarsıdıcı|güclü,təsir,dəyişmək,şok,ağır
Çeviklik|tez,hərəkət,yüngül,çevrilmək,bacarıq
Xəfiflik|yüngül,asan,hava,ağırlıq,toxuma
Dəqiqlik|düzgün,tam,ölçü,qayda,səhvsiz
Etinasızlıq|baxmamaq,fikir verməmək,laqeyd,diqqət,davranış
İtiraf|demək,qəbul etmək,günah,söz,açıq
Azadlıq|sərbəst,qadağa yoxdur,seçim,bağlılıq yoxdur,hüquq
Yük|ağır,çiyin,daşımaq,məsuliyyət,çətin
Toxumaq|parça,ip,əllə,tikiş,sənət
Siluet|kölgə,şəkil,qaranlıq,forma,insan
Sakitləşmək|əsəb,durmaq,rahatlamaq,sakit,hiss
Əksolunma|geri dönmək,işıq,su,səth,görüntü
Dirilmək|yenidən,ruh,ölüm,canlanmaq,həyat
Uzaqlaşmaq|getmək,məsafə,ayrılmaq,uzaq,çıxmaq
Çöküş|düşmək,vəziyyət,pis,dağıntı,problem
Qarşıdurma|dava,mübahisə,fikir,düşmən,qarşı
Əksiklik|çatışmazlıq,az,natamam,yetərsiz,boş
Qorunmaq|təhlükə,gizlənmək,təhlükəsizlik,saxlamaq,müdafiə
Çevrilmək|dəyişmək,dönmək,forma,hal,yeni
`;


// --- ENGLISH ---
const EN_EASY = `
Soccer|ball,player,goal,team,sport
Phone|call,mobile,screen,text,talk
Car|driver,road,wheel,engine,gas
Water|drink,liquid,bottle,tap,clean
Book|page,author,read,paper,text
Sun|light,hot,sky,bright,day
Pizza|cheese,sauce,italian,round,food
School|class,teacher,student,learn,study
Baby|small,family,cry,born,diaper
Ice|cold,water,freeze,clear,cube
Clock|time,hand,minute,second,wall
Bread|flour,eat,bake,warm,dough
Ice cream|cold,sweet,summer,cone,vanilla
Fish|water,sea,swim,scale,food
Milk|white,drink,cow,calcium,food
House|room,door,window,live,building
Tree|green,leaves,plant,forest,wood
Dog|animal,bark,pet,tail,bone
Cat|meow,fur,pet,small,play
Computer|keyboard,mouse,screen,internet,laptop
`;
const EN_MEDIUM = `
Rain|cloud,wet,weather,drop,sky
Snow|white,cold,winter,flake,fall
Storm|wind,loud,weather,thunder,lightning
Fridge|kitchen,cold,food,keep,ice
Oven|heat,cook,food,kitchen,bake
Silence|quiet,noise,sound,room,hush
Dream|sleep,night,bed,mind,wake
Forest|tree,green,animal,nature,wood
Travel|trip,go,plane,bag,holiday
Camera|photo,picture,lens,shoot,flash
Ticket|movie,plane,paper,enter,pay
Umbrella|rain,open,hold,dry,weather
Bridge|cross,river,water,road,structure
Candle|light,fire,wax,burn,wick
Ocean|water,wave,blue,sea,beach
Newspaper|read,paper,news,daily,print
Mail|letter,post,send,stamp,box
Sugar|sweet,white,tea,coffee,baking
Bird|fly,wing,feather,sky,nest
Flower|rose,garden,plant,smell,petal
`;
const EN_HARD = `
Imagination|dream,mind,think,creative,idea
Willpower|strength,determination,mind,control,force
Defeat|lose,win,game,match,fail
Patience|wait,time,calm,long,hurry
Mystery|secret,hidden,unknown,puzzle,solve
Coincidence|chance,plan,happen,same,time
Perception|see,mind,understand,view,sense
Heritage|history,past,culture,family,legacy
Evolution|change,time,darwin,monkey,develop
Consequence|result,action,happen,after,bad
Integrity|honest,moral,truth,character,good
Paradox|confusing,true,false,logic,contradiction
Metaphor|compare,like,literary,word,figure
Sarcasm|joke,mean,tone,irony,funny
Nostalgia|past,memory,miss,old,time
Ambition|goal,dream,success,work,drive
Hypocrisy|fake,say,do,judge,pretend
Cynical|trust,negative,believe,people,bad
Optimism|positive,hope,good,future,glass
Resilience|strong,back,tough,recover,hard
`;

// --- RUSSIAN ---
const RU_EASY = `
Футбол|мяч,игрок,ворота,гол,команда
Телефон|звонок,мобильный,экран,смс,говорить
Машина|водитель,дорога,колесо,мотор,бензин
Вода|пить,жидкость,бутылка,кран,чистая
Книга|страница,автор,читать,бумага,текст
Солнце|свет,тепло,небо,яркое,день
Пицца|сыр,соус,италия,тесто,круг
Школа|урок,учитель,класс,ученик,парту
Ребенок|маленький,семья,играть,родиться,школа
Лед|холод,вода,заморозить,прозрачный,кубик
Часы|время,стрелка,минута,секунда,стена
Хлеб|мука,еда,печь,горячий,тесто
Мороженое|холодное,сладкое,лето,рожок,ваниль
Рыба|вода,море,плавать,чешуя,еда
Молоко|белое,пить,корова,кальций,еда
Дом|комната,дверь,окно,жить,здание
Дерево|зеленое,листья,растение,лес,ствол
Собака|животное,лаять,друг,хвост,кость
Кошка|мяу,шерсть,домашнее,играть,усы
Компьютер|монитор,клавиатура,мышь,экран,интернет
`;
const RU_MEDIUM = `
Дождь|облако,мокро,погода,капля,небо
Снег|белый,холод,зима,снежинка,падать
Шторм|ветер,сильный,погода,гром,молния
Холодильник|кухня,холод,еда,хранить,лед
Духовка|тепло,готовить,еда,кухня,печь
Тишина|тихо,звук,шум,комната,молчать
Сон|спать,ночь,кровать,подушка,видеть
Лес|дерево,зеленый,животные,природа,грибы
Путешествие|поездка,ехать,самолет,чемодан,отпуск
Камера|фото,снимок,объектив,снимать,вспышка
Билет|кино,самолет,бумага,вход,платить
Зонт|дождь,открыть,держать,сухой,погода
Мост|переходить,река,вода,дорога,строение
Свеча|свет,огонь,воск,гореть,фитиль
Океан|вода,волна,синий,море,пляж
Газета|читать,бумага,новости,утро,печать
Почта|письмо,отправить,конверт,марка,ящик
Сахар|сладкий,белый,чай,кофе,песок
Птица|летать,крыло,перо,небо,гнездо
Цветок|роза,сад,растение,запах,лепесток
`;
const RU_HARD = `
Воображение|мечта,ум,думать,творчество,идея
Сила воли|сила,решение,ум,контроль,характер
Поражение|проиграть,победа,игра,матч,неудача
Терпение|ждать,время,спокойствие,долго,спешить
Тайна|секрет,скрыто,неизвестно,загадка,разгадать
Совпадение|случай,план,случиться,время,одинаково
Восприятие|видеть,ум,понимать,взгляд,чувство
Наследие|история,прошлое,культура,семья,предки
Эволюция|изменение,время,дарвин,обезьяна,развитие
Последствие|результат,действие,случиться,после,плохо
Честность|правда,мораль,лгать,характер,хороший
Парадокс|путаница,правда,ложь,логика,противоречие
Метафора|сравнение,как,слово,образ,литература
Сарказм|шутка,злой,тон,ирония,смешно
Ностальгия|прошлое,память,скучать,старое,время
Амбиция|цель,мечта,успех,работа,стремление
Лицемерие|фальшь,говорить,делать,судить,притворяться
Цинизм|доверие,негатив,верить,люди,плохо
Оптимизм|позитив,надежда,хорошо,будущее,стакан
Устойчивость|сильный,назад,крепкий,восстановить,трудно
`;

// --- SPANISH ---
const ES_EASY = `
Fútbol|balón,jugador,gol,equipo,deporte
Teléfono|llamada,móvil,pantalla,texto,hablar
Coche|conductor,carretera,rueda,motor,gasolina
Agua|beber,líquido,botella,grifo,limpia
Libro|página,autor,leer,papel,texto
Sol|luz,caliente,cielo,brillante,día
Pizza|queso,salsa,italiana,redonda,comida
Escuela|clase,maestro,estudiante,aprender,estudiar
`;
const ES_MEDIUM = `
Lluvia|nube,mojado,clima,gota,cielo
Nieve|blanca,frío,invierno,copo,caer
Tormenta|viento,fuerte,clima,trueno,rayo
Refrigerador|cocina,frío,comida,guardar,hielo
Horno|calor,cocinar,comida,cocina,hornear
Silencio|tranquilo,ruido,sonido,habitación,callar
Sueño|dormir,noche,cama,mente,despertar
`;
const ES_HARD = `
Imaginación|sueño,mente,pensar,creativo,idea
Voluntad|fuerza,determinación,mente,control,fuerza
Derrota|perder,ganar,juego,partido,fallar
Paciencia|esperar,tiempo,calma,largo,prisa
Misterio|secreto,oculto,desconocido,rompecabezas,resolver
`;

// --- FRENCH ---
const FR_EASY = `
Football|ballon,joueur,but,équipe,sport
Téléphone|appel,mobile,écran,texte,parler
Voiture|conducteur,route,roue,moteur,essence
Eau|boire,liquide,bouteille,robinet,propre
Livre|page,auteur,lire,papier,texte
Soleil|lumière,chaud,ciel,brillant,jour
Pizza|fromage,sauce,italienne,ronde,nourriture
École|classe,professeur,étudiant,apprendre,étudier
`;
const FR_MEDIUM = `
Pluie|nuage,mouillé,temps,goutte,ciel
Neige|blanc,froid,hiver,flocon,tomber
Tempête|vent,fort,temps,tonnerre,foudre
Frigo|cuisine,froid,nourriture,garder,glace
Four|chaleur,cuisiner,nourriture,cuisine,cuire
Silence|calme,bruit,son,chambre,chut
Rêve|dormir,nuit,lit,esprit,réveil
`;
const FR_HARD = `
Imagination|rêve,esprit,penser,créatif,idée
Volonté|force,détermination,esprit,contrôle,force
Défaite|perdre,gagner,jeu,match,échouer
Patience|attendre,temps,calme,long,hâte
Mystère|secret,caché,inconnu,puzzle,résoudre
`;

// --- PORTUGUESE ---
const PT_EASY = `
Futebol|bola,jogador,gol,time,esporte
Telefone|ligação,celular,tela,texto,falar
Carro|motorista,estrada,roda,motor,gasolina
Água|beber,líquido,garrafa,torneira,limpa
Livro|página,autor,ler,papel,texto
Sol|luz,quente,céu,brilhante,dia
Pizza|queijo,molho,italiana,redonda,comida
Escola|aula,professor,estudante,aprender,estudar
`;
const PT_MEDIUM = `
Chuva|nuvem,molhado,clima,gota,céu
Neve|branca,frio,inverno,floco,cair
Tempestade|vento,forte,clima,trovão,raio
Geladeira|cozinha,frio,comida,guardar,gelo
Forno|calor,cozinhar,comida,cozinha,assar
Silêncio|quieto,ruído,som,quarto,calar
Sonho|dormir,noite,cama,mente,acordar
`;
const PT_HARD = `
Imaginação|sonho,mente,pensar,criativo,ideia
Vontade|força,determinação,mente,controle,força
Derrota|perder,ganhar,jogo,partida,falhar
Paciência|esperar,tempo,calma,longo,pressa
Mistério|segredo,oculto,desconhecido,quebra-cabeça,resolver
`;

// --- ARABIC ---
const AR_EASY = `
كرة القدم|كرة,لاعب,هدف,فريق,رياضة
هاتف|مكالمة,موبايل,شاشة,نص,تحدث
سيارة|سائق,طريق,عجلة,محرك,بنزين
ماء|شرب,سائل,زجاجة,صنبور,نظيف
كتاب|صفحة,مؤلف,قراءة,ورق,نص
شمس|ضوء,حار,سماء,ساطع,يوم
بيتزا|جبن,صلصة,إيطالية,دائرية,طعام
مدرسة|صف,معلم,طالب,تعلم,دراسة
`;
const AR_MEDIUM = `
مطر|سحابة,مبلل,طقس,قطرة,سماء
ثلج|أبيض,برد,شتاء,ندفة,سقوط
عاصفة|رياح,قوي,طقس,رعد,برق
ثلاجة|مطبخ,برد,طعام,حفظ,ثلج
فرن|حرارة,طبخ,طعام,مطبخ,خبز
صمت|هادئ,ضجيج,صوت,غرفة,سكوت
حلم|نوم,ليل,سرير,عقل,استيقاظ
`;
const AR_HARD = `
خيال|حلم,عقل,تفكير,إبداع,فكرة
إرادة|قوة,عزيمة,عقل,تحكم,قوة
هزيمة|خسارة,فوز,لعبة,مباراة,فشل
صبر|انتظار,وقت,هدوء,طويل,عجلة
لغز|سر,مخفي,مجهول,لغز,حل
`;

// Combine into structured object
export const STATIC_CARDS: Record<Language, Record<Difficulty, TabooCard[]>> = {
  AZ: {
    EASY: parse(AZ_EASY),
    MEDIUM: parse(AZ_MEDIUM),
    HARD: parse(AZ_HARD),
  },
  EN: {
    EASY: parse(EN_EASY),
    MEDIUM: parse(EN_MEDIUM),
    HARD: parse(EN_HARD),
  },
  RU: {
    EASY: parse(RU_EASY),
    MEDIUM: parse(RU_MEDIUM),
    HARD: parse(RU_HARD),
  },
  ES: {
    EASY: parse(ES_EASY),
    MEDIUM: parse(ES_MEDIUM),
    HARD: parse(ES_HARD),
  },
  FR: {
    EASY: parse(FR_EASY),
    MEDIUM: parse(FR_MEDIUM),
    HARD: parse(FR_HARD),
  },
  PT: {
    EASY: parse(PT_EASY),
    MEDIUM: parse(PT_MEDIUM),
    HARD: parse(PT_HARD),
  },
  AR: {
    EASY: parse(AR_EASY),
    MEDIUM: parse(AR_MEDIUM),
    HARD: parse(AR_HARD),
  }
};
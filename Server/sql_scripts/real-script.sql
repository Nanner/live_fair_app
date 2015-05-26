
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") VALUES ('0cad5dd2-3dac-41e4-ad48-ba8548318350','nmartinho@gmail.com','7b88325ed9253df6c5061bd7ffe2e790ee9705d95d072ae831fa432df220853fc38ec49e7ac0de6de6c8cb8c7619448b62d1f14ba0ebfb0075c7367597a289b2','visitor',912898691,NULL,False,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") VALUES ('9a47afbd-7700-4ebc-9b36-38febdbff030','procha@gmail.com','7b88325ed9253df6c5061bd7ffe2e790ee9705d95d072ae831fa432df220853fc38ec49e7ac0de6de6c8cb8c7619448b62d1f14ba0ebfb0075c7367597a289b2','visitor',NULL,NULL,False,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") VALUES ('f3bff850-02a0-4fd4-b045-9604e091d880','dsantos@gmail.com','7b88325ed9253df6c5061bd7ffe2e790ee9705d95d072ae831fa432df220853fc38ec49e7ac0de6de6c8cb8c7619448b62d1f14ba0ebfb0075c7367597a289b2','visitor',917654321,NULL,False,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") VALUES ('79a2da11-a664-45f1-8fee-3357dbae2670','pfaria@gmail.com','7b88325ed9253df6c5061bd7ffe2e790ee9705d95d072ae831fa432df220853fc38ec49e7ac0de6de6c8cb8c7619448b62d1f14ba0ebfb0075c7367597a289b2','visitor',NULL,NULL,False,'13.05.2015 23:07:00','13.05.2015 23:07:00');

INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") 
VALUES ('1cb7eee5-30bf-4a9a-91ef-cba731368403','amt@gmail.com','abcde','company',912345678,'Empresa de consultoria',False,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") 
VALUES ('5ead1699-b712-458b-a6ab-47e301647df2','glintt@gmail.com','abcde','company',NULL,'empresa',False,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") 
VALUES ('aeb93c10-e1d1-4198-9c26-a486ea805eec','altran@gmail.com','abcde','company',918765432,'Empresa lgp',False,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") 
VALUES ('907f9410-6252-4bc1-b880-668e99cb8be5','deloitte@gmail.com','abcde','company',NULL,NULL,False,'13.05.2015 23:07:00','13.05.2015 23:07:00');  

INSERT INTO "public"."user" ("userID","email","password","type","contact","description","blocked","createdAt","updatedAt") 
VALUES ('3fde43a0-ca0a-4abe-ad37-841b58b4ca73','feup@gmail.com','abcde','organizer',NULL,NULL,False,'13.05.2015 23:07:00','13.05.2015 23:07:00'); 

INSERT INTO "public"."visitor" ("visitorID","Photo","createdAt","updatedAt") VALUES ('0cad5dd2-3dac-41e4-ad48-ba8548318350',NULL,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."visitor" ("visitorID","Photo","createdAt","updatedAt") VALUES ('9a47afbd-7700-4ebc-9b36-38febdbff030',NULL,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."visitor" ("visitorID","Photo","createdAt","updatedAt") VALUES ('f3bff850-02a0-4fd4-b045-9604e091d880',NULL,'13.05.2015 23:07:00','13.05.2015 23:07:00');
INSERT INTO "public"."visitor" ("visitorID","Photo","createdAt","updatedAt") VALUES ('79a2da11-a664-45f1-8fee-3357dbae2670',NULL,'13.05.2015 23:07:00','13.05.2015 23:07:00');

INSERT INTO "public"."company" ("companyID","companyName","logoImage","website","visitorCounter","createdAt","updatedAt","address") 
VALUES ('1cb7eee5-30bf-4a9a-91ef-cba731368403','AMT Consulting','amt.png','http://www.amt-consulting.com/',0,'13.05.2015 23:07:00','13.05.2015 23:07:00','Porto A');
INSERT INTO "public"."company" ("companyID","companyName","logoImage","website","visitorCounter","createdAt","updatedAt","address") 
VALUES ('5ead1699-b712-458b-a6ab-47e301647df2','Glintt','glintt.png','http://www.glintt.com/',0,'13.05.2015 23:07:00','13.05.2015 23:07:00','Porto B');
INSERT INTO "public"."company" ("companyID","companyName","logoImage","website","visitorCounter","createdAt","updatedAt","address") 
VALUES ('aeb93c10-e1d1-4198-9c26-a486ea805eec','Altran','altran.png','http://www.altran.pt/',0,'13.05.2015 23:07:00','13.05.2015 23:07:00','Porto C');
INSERT INTO "public"."company" ("companyID","companyName","logoImage","website","visitorCounter","createdAt","updatedAt","address") 
VALUES ('907f9410-6252-4bc1-b880-668e99cb8be5','Deloitte','del.png','http://www.deloitte.com/',0,'13.05.2015 23:07:00','13.05.2015 23:07:00','Porto D');
 
INSERT INTO "public"."companyEvents" ("companyEventsID","location","startTime","endTime","speakers","subject","createdAt","updatedAt") 
VALUES ('8da8aa78-e7e3-4dd7-b0c9-194ed939cec6','FEUP - Auditório 1','15.05.2009 16:17:00','15.05.2009 16:17:00','Diogo Santos','Apresentacao LGP','13.05.2015 23:07:00','13.05.2015 23:07:00');

INSERT INTO "public"."organizer" ("organizerID","organizerName","createdAt","updatedAt") 
VALUES ('3fde43a0-ca0a-4abe-ad37-841b58b4ca73','FEUP','13.05.2015 23:07:00','13.05.2015 23:07:00');
 
INSERT INTO "public"."liveFair" ("liveFairID","name","description","startDate","endDate","local","address","city","map","createdAt","updatedAt","organizerOrganizerID") 
VALUES ('67118f9f-561a-8025-850a-ac0ea5b29880','FEUP Carreer Fair','Oportunidade dos alunos contactarem empresas','15.05.2015 00:00:00','15.05.2015 00:00:00','FEUP','Rua Roberto Frias','Porto','feupcarreerfair.png','13.05.2015 23:07:00','13.05.2015 23:07:00','3fde43a0-ca0a-4abe-ad37-841b58b4ca73');

INSERT INTO "public"."connection" ("liked","sharedContact","createdAt","updatedAt","visitorVisitorID","companyCompanyID") 
VALUES (True,True,'13.05.2015 23:07:00','13.05.2015 23:07:00','0cad5dd2-3dac-41e4-ad48-ba8548318350','1cb7eee5-30bf-4a9a-91ef-cba731368403');
 
INSERT INTO "public"."interest" ("interestID","interest","createdAt","updatedAt","liveFairLiveFairID") 
VALUES ('e85e6185-6bd0-47be-97e0-5eee09cb3ba9','Emprego','13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880');
INSERT INTO "public"."interest" ("interestID","interest","createdAt","updatedAt","liveFairLiveFairID") 
VALUES ('336d5f7f-3231-45ce-891c-55b0037b02da','Tese','13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880');
INSERT INTO "public"."interest" ("interestID","interest","createdAt","updatedAt","liveFairLiveFairID") 
VALUES ('c28e2453-df71-49a3-9014-b041b486b580','Estágio Profissional','13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880');
 
INSERT INTO "public"."liveFairEvents" ("id","eventLocation","startTime","endTime","speakers","subject","createdAt","updatedAt","liveFairEventsID") 
VALUES (0,'Auditório B001','15.05.2015 16:30:00','13.05.2015 23:07:00','Prof. Augusto Sousa','Pedagogia no Trabalho','13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880');
 
INSERT INTO "public"."visitor_liveFair" ("createdAt","updatedAt","liveFairLiveFairID","visitorVisitorID") 
VALUES ('13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880','0cad5dd2-3dac-41e4-ad48-ba8548318350');

INSERT INTO "public"."liveFairCompanyEvents" ("id","liveFairIDref","companyIDref","companyEventsIDref","createdAt","updatedAt") 
VALUES (0,'67118f9f-561a-8025-850a-ac0ea5b29880','1cb7eee5-30bf-4a9a-91ef-cba731368403','8da8aa78-e7e3-4dd7-b0c9-194ed939cec6','13.05.2015 23:07:00','13.05.2015 23:07:00');
  
INSERT INTO "public"."liveFairVisitorInterest" ("id","liveFairIDref","visitorIDref","interestIDref","createdAt","updatedAt") 
VALUES (0,'67118f9f-561a-8025-850a-ac0ea5b29880','0cad5dd2-3dac-41e4-ad48-ba8548318350','e85e6185-6bd0-47be-97e0-5eee09cb3ba9','13.05.2015 23:07:00','13.05.2015 23:07:00');
 
INSERT INTO "public"."liveFairInterest" ("createdAt","updatedAt","liveFairLiveFairID","interestInterestID") 
VALUES ('13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880','e85e6185-6bd0-47be-97e0-5eee09cb3ba9');
 
INSERT INTO "public"."liveFairCompanyInterest" ("id","liveFairIDref","companyIDref","interestIDref","createdAt","updatedAt") 
VALUES (0,'67118f9f-561a-8025-850a-ac0ea5b29880','1cb7eee5-30bf-4a9a-91ef-cba731368403','e85e6185-6bd0-47be-97e0-5eee09cb3ba9','13.05.2015 23:07:00','13.05.2015 23:07:00');
 
INSERT INTO "public"."stands" ("standLocation","approved","createdAt","updatedAt","liveFairLiveFairID","companyCompanyID","visitorCounter") 
VALUES ('42',True,'13.05.2015 23:07:00','13.05.2015 23:07:00','67118f9f-561a-8025-850a-ac0ea5b29880','1cb7eee5-30bf-4a9a-91ef-cba731368403',0);

-- CreateTable
CREATE TABLE "applicant_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "applicant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_vacancies" (
    "applicant_profile_id" INTEGER NOT NULL,
    "vacancy_id" INTEGER NOT NULL,

    CONSTRAINT "applicant_vacancies_pkey" PRIMARY KEY ("applicant_profile_id","vacancy_id")
);

-- CreateTable
CREATE TABLE "employer_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "employer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer_vacancies" (
    "employer_profile_id" INTEGER NOT NULL,
    "vacancy_id" INTEGER NOT NULL,

    CONSTRAINT "employer_vacancies_pkey" PRIMARY KEY ("employer_profile_id","vacancy_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacancies" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(255) NOT NULL,
    "employer_id" INTEGER,

    CONSTRAINT "vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "applicant_profiles" ADD CONSTRAINT "applicant_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant_vacancies" ADD CONSTRAINT "applicant_vacancies_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant_vacancies" ADD CONSTRAINT "applicant_vacancies_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employer_vacancies" ADD CONSTRAINT "employer_vacancies_employer_profile_id_fkey" FOREIGN KEY ("employer_profile_id") REFERENCES "employer_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employer_vacancies" ADD CONSTRAINT "employer_vacancies_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;


CREATE TABLE teachers_sfath (
    teacher_id INT NOT NULL AUTO_INCREMENT,
    full_name varchar(50),
    email VARCHAR(50),
    phone VARCHAR(10),
    gen_location varchar(10),
    about varchar(400),
    residence varchar(25),
    ages varchar(10),
    population VARCHAR(15),
    exp VARCHAR(15),
    work_pref VARCHAR(25),
    PRIMARY KEY (teacher_id)
);
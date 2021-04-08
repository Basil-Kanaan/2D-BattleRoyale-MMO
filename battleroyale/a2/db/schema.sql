--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql
DROP TABLE Scores;
DROP TABLE GameParams;
DROP TABLE ftduser;

CREATE TABLE ftduser (
	username VARCHAR(20) PRIMARY KEY,
	password BYTEA NOT NULL,
	birthday VARCHAR(10),
	skill VARCHAR(12),
	day TEXT[]
);
CREATE TABLE Scores(
	username VARCHAR(20) REFERENCES ftduser,
	score int,
	difficulty VARCHAR(10)
);
CREATE TABLE GameParams(
	username VARCHAR(20) PRIMARY KEY REFERENCES ftduser,
	difficulty VARCHAR(6) 
);
--- Could have also stored as 128 character hex encoded values
--- select char_length(encode(sha512('abc'), 'hex')); --- returns 128
INSERT INTO ftduser VALUES('user1', sha512('password1'), '2000-11-10','Beginner' , ARRAY['Night']);
INSERT INTO ftduser VALUES('user2', sha512('password2'), '2000-11-10','Beginner' , ARRAY['Morning','Night']);
INSERT INTO Scores VALUES('user1', 0, 'Easy');
INSERT INTO Scores VALUES('user2', 0, 'Easy');
INSERT INTO GameParams VALUES('user1', 'Easy');
INSERT INTO GameParams VALUES('user2', 'Easy');
 

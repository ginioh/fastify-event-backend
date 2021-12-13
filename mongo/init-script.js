db = db.getSiblingDB('fastify-test');

db.createUser({
    user: 'ginioh',
    pwd: 'ginioh_fastify_test',
    roles: [
      {
        role: 'readWrite',
        db: 'fastify-test',
      },
    ],
  });

db = db.getSiblingDB('tests');
db.createUser({
    user: 'ginioh_test',
    pwd: 'ginioh_fastify_test',
    roles: [
      {
        role: 'readWrite',
        db: 'tests',
      },
    ],
  });
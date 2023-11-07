/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user').del()
  await knex('user').insert([
    {spotify_id:'admin', display_name: 'admin', profile_img:'https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png', login_status: false},
  ]);
};

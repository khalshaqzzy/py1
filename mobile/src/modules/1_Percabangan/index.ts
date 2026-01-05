import Section1 from './Section1';
import Section2 from './Section2';
// ... Section lainnya akan diporting bertahap

const module1 = {
  id: '1',
  title: 'Percabangan',
  description: 'Mempelajari cara membuat program mengambil keputusan menggunakan struktur if, elif, dan else.',
  sections: [
    { id: '1', title: 'Pengantar Logika', component: Section1 },
    { id: '2', title: 'Operator Perbandingan', component: Section2 },
  ],
};

export default module1;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const page = await prisma.contentPage.findUnique({ where: { slug: 'contact' } });
    if (!page) {
      console.log('Contact page not found in CMS. Creating one...');
      await prisma.contentPage.create({
        data: {
          slug: 'contact',
          title: 'Contact Us',
        }
      });
    }
    const contactPage = await prisma.contentPage.findUnique({ where: { slug: 'contact' } });

    const contactMainContent = {
      title: 'Contact Us',
      address: 'C. Abdul Hakeem College of Engineering & Technology,\nMelvisharam-632509, Vellore District,\nTamil Nadu, INDIA.',
      phones: ['+91 4172-267387'],
      emails: ['info.cahcet@gmail.com'],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.378713217277!2d79.29748521528646!3d12.928373117462058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad35c15e8d53ef%3A0xc6651da05dcf9f5f!2sC.%20Abdul%20Hakeem%20College%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      timings: 'Mon - Sat: 9AM - 5PM',
      departments: [
        {
          name: 'Office of Correspondent',
          person: 'Correspondent',
          email: 'correspondent@cahcet.edu.in',
          phone: '+91 4172-267387 #102'
        },
        {
          name: 'Office of Principal',
          person: 'Dr. Sasikumar',
          email: 'principal@cahcet.edu.in',
          phone: '+91 4172-267387 #105'
        },
        {
          name: 'Office of COE',
          person: 'COE',
          email: 'coe@cahcet.edu.in',
          phone: '+91 4172-267387 #109'
        },
        {
          name: 'Anti-Ragging committee',
          person: 'Dr. Sasikumar',
          email: 'principal@cahcet.edu.in',
          phone: '+91 4172-267387 #105'
        },
        {
          name: 'Placement and training cell',
          person: 'Mr. Palanisamy B / Mr. I. Abdulla / Mr. D.L. Jaseer Ahmed',
          email: 'pat@cahcet.edu.in'
        },
        {
          name: 'Background student verification',
          person: 'Mr. Palanisamy B / Mr. D.L. Jaseer Ahmed',
          email: 'jaseer.pat@cahcet.edu.in'
        },
        {
          name: 'Office of posh cell',
          person: 'Dr. Sasikumar',
          email: 'principal@cahcet.edu.in'
        },
        {
          name: 'Network server cell',
          person: 'Mr. G. Abdul Basith',
          email: 'nsc@cahcet.edu.in',
          phone: '+91 4172-267387 #112'
        },
        {
          name: 'NSS programme officer',
          person: 'Mr. V. Pushparaj',
          email: 'vp.maths@cahcet.edu.in',
          phone: '+91 4172-267387'
        },
        {
          name: 'deputy warden - hostel',
          person: 'Dr.Irshad Ahmed',
          email: 'irshadahmed.mba@cahcet.edu.in',
          phone: '+91 4172-266665 #134'
        },
        {
          name: 'Proctor - Hostel',
          person: 'Mr. A. Inayathullah',
          email: 'inyathullah.ece@cahcet.edu.in',
          phone: '+91 4172-266665 #134'
        },
        {
          name: 'Proctor - Hostel',
          person: 'Mr.A.Mohamed khalif',
          email: 'khalif.civil@cahcet.edu.in',
          phone: '+91 4172-268897 #102'
        }
      ]
    };

    const existing = await prisma.contentSection.findFirst({
      where: { pageId: contactPage.id, sectionKey: 'contact.main' }
    });

    if (existing) {
      await prisma.contentSection.update({
        where: { id: existing.id },
        data: { content: JSON.stringify(contactMainContent) }
      });
    } else {
      await prisma.contentSection.create({
        data: {
          pageId: contactPage.id,
          sectionKey: 'contact.main',
          title: 'Main',
          content: JSON.stringify(contactMainContent)
        }
      });
    }
    console.log('Contact CMS data updated successfully.');
  } catch (error) {
    console.error('Error updating Contact CMS:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

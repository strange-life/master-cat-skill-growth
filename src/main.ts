import { readAsText } from './reader';
import parse from './parser';
import './style.css';

const regSkillSuccess = /^进行(\S+)检定.*?成功$/;

function createPlayerElement(name: string, skills: string[]) {
  const nameElement = document.createElement('div');
  nameElement.classList.add('player-name');
  nameElement.textContent = name;

  const skillElements = skills.map(function (skill) {
    const skillElement = document.createElement('div');
    skillElement.textContent = skill;
    return skillElement;
  });
  const skillsContainer = document.createElement('div');
  skillsContainer.classList.add('player-skills');
  skillsContainer.append(...skillElements);

  const playerElement = document.createElement('div');
  playerElement.classList.add('player');
  playerElement.append(nameElement, skillsContainer);

  return playerElement;
}

const players = document.querySelector<HTMLDivElement>('.players');

document
  .querySelector<HTMLInputElement>('#logs')
  ?.addEventListener('change', async function () {
    if (!this.files || !this.files.length) return;

    const file = this.files[0];

    try {
      const logs = await readAsText(file);
      if (!logs) {
        alert('空文件');
        return;
      }

      const dict = parse(logs);
      const playerElements = Object.values(dict)
        .filter((sections) =>
          sections.some((section) => regSkillSuccess.test(section.content)),
        )
        .map(function (sections) {
          const name = sections[0].name;
          const skills = sections.reduce<string[]>(function (acc, section) {
            const execArr = regSkillSuccess.exec(section.content);

            if (execArr) {
              const [, skill] = execArr;
              if (!acc.includes(skill)) acc.push(skill);
            }

            return acc;
          }, []);

          return createPlayerElement(name, skills);
        });

      players?.append(...playerElements);
    } catch (error) {
      console.error(error);
      alert('读取文件失败');
    }
  });

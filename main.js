const output = document.getElementById('output');
const form = document.getElementById('input-form');
const input = document.getElementById('command');
const cwdLabel = document.querySelector('.cwd');

const HOME = '/home/arozoid';

// virtual filesystem

const filesystem = {
    type: 'dir',
    children: {
        home: {
            type: 'dir',
            children: {
            arozoid: {
                type: 'dir',
                children: {
                    README: {
                        type: 'file',
                        content: [
                            { text: 'arozoid', color: 'blue-text' },
                            { text: 'aspiring game/systems developer' },
                            { text: '' },

                            { text: 'navigation:', color: 'yellow-text' },
                            { text: '  ls [path]       list directory contents' },
                            { text: '  cd [path]       change directory' },
                            { text: '  pwd             print working directory' },
                            { text: '  cat [file]      read a file' },
                            { text: '  clear           clear terminal' },
                            { text: '  help            list available commands' }
                        ]
                    },

                    projects: {
                        type: 'dir',
                        children: {
                            'pingu-igloo': {
                                type: 'file',
                                content: [
                                    { text: 'pingu igloo', color: 'green-text' },
                                    { text: 'upcoming communications program that remains both private and convenient.' },
                                    { text: '' },
                                    { text: 'repository:' },
                                    { text: 'https://github.com/pingu-hq', link: true }
                                ]
                            },

                            'rstl.sway': {
                                type: 'file',
                                content: [
                                    { text: 'rstl.sway', color: 'green-text' },
                                    { text: 'highly minimal and efficient personal linux distribution and desktop based on sway.' },
                                    { text: '' },
                                    { text: 'repository:' },
                                    { text: 'https://github.com/arozoid/rstl.sway', link: true }
                                ]
                            }
                        }
                    },

                    links: {
                        type: 'dir',
                        children: {
                            github: {
                                type: 'file',
                                content: [
                                    { text: 'github profile', color: 'blue-text' },
                                    { text: 'https://github.com/arozoid', link: true }
                                ]
                            },

                            youtube: {
                                type: 'file',
                                content: [
                                    { text: 'youtube channel', color: 'blue-text' },
                                    { text: 'https://youtube.com/arozoid', link: true }
                                ]
                            },

                            discord: {
                                type: 'file',
                                content: [
                                    { text: 'discord server', color: 'blue-text' },
                                    { text: 'https://discord.gg/Q6d9tuSqmN', link: true }
                                ]
                            },

                            guides: {
                                type: 'dir',
                                children: {
                                    'android-linux-lab': {
                                        type: 'file',
                                        content: [
                                            { text: 'android linux lab guide pack', color: 'blue-text' },
                                            { text: 'https://paint-hub-11d.notion.site/Android-Linux-Lab-Guide-Pack-33e8eb79935580c0a129eb91dd75f407?pvs=74', link: true }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        }
    }
};

let cwd = HOME;
let history = [];
let historyIndex = 0;

// filesystem helpers

function resolvePath(path) {
    if (!path || path === '~') return HOME;

    let parts = path.startsWith('/')
        ? []
        : cwd.split('/').filter(Boolean);

    if (path.startsWith('~')) {
        parts = HOME.split('/').filter(Boolean);
        path = path.slice(1);
    }

    for (const part of path.split('/')) {
        if (!part || part === '.') continue;

        if (part === '..') {
            parts.pop();
        } else {
            parts.push(part);
        }
    }

    return '/' + parts.join('/');
}

function getNode(path) {
    const parts = path.split('/').filter(Boolean);
    let node = filesystem;

    for (const part of parts) {
        if (
            node.type !== 'dir' ||
            !Object.prototype.hasOwnProperty.call(node.children, part)
        ) {
            return null;
        }

        node = node.children[part];
    }

    return node;
}

function displayPath(path = cwd) {
    if (path === HOME) return '~';
    if (path.startsWith(HOME + '/')) {
        return '~' + path.slice(HOME.length);
    }
    return path;
}

function getArguments(args) {
    return args.join(' ');
}

// output helpers

function createGroup() {
    const group = document.createElement('div');
    group.className = 'output-group';
    output.appendChild(group);
    return group;
}

function print(text = '', color = '') {
    const group = createGroup();
    const line = document.createElement('div');

    line.className = 'output-line ' + color;
    line.textContent = text;

    group.appendChild(line);
}

function printContent(content) {
    const group = createGroup();

    for (const item of content) {
        const line = document.createElement('div');
        line.className = 'output-line ' + (item.color || '');

        if (item.link) {
            const anchor = document.createElement('a');
            anchor.href = item.text;
            anchor.textContent = item.text;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.className = 'terminal-link';
            line.appendChild(anchor);
        } else {
            line.textContent = item.text;
        }

        group.appendChild(line);
    }
}

function printPrompt(command) {
    const group = createGroup();

    const line = document.createElement('div');
    line.className = 'output-line';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';

    const user = document.createElement('span');
    user.className = 'user';
    user.textContent = 'arozoid@web';

    const path = document.createElement('span');
    path.className = 'cwd';
    path.textContent = displayPath();

    prompt.append(user, ':', path, '$ ');

    const text = document.createElement('span');
    text.textContent = command;

    line.append(prompt, text);
    group.appendChild(line);
}

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

function updatePrompt() {
    cwdLabel.textContent = displayPath();
}

// startup

function startup() {
    print('arozoid@web', 'green-text');
    print('aspiring software / systems developer', 'muted');
    print('');
    print('navigation:', 'yellow-text');
    print('  ls [path]       list directory contents');
    print('  cd [path]       change directory');
    print('  pwd             print working directory');
    print('  cat [file]      read a file');
    print('  clear           clear terminal');
    print('  help            list available commands');
    print('');
    print('try: ls', 'blue-text');
    print('');
}

startup();

// command handlers

const commands = {
    help() {
        print('available commands:', 'yellow-text');
        print('  ls [path]       list directory contents');
        print('  cd [path]       change directory');
        print('  pwd             print working directory');
        print('  cat [file]      read a file');
        print('  clear           clear terminal');
        print('  whoami          display user information');
        print('  echo [text]     print text');
        print('  help            show this message');
        print('  history         show previous commands');
    },

    ls(args = []) {
        const target = args[0] || '.';
        const path = resolvePath(target);
        const node = getNode(path);

        if (!node) {
            print(`ls: cannot access '${target}': no such file or directory`, 'red-text');
            return;
        }

        if (node.type !== 'dir') {
            print(target, 'file');
            return;
        }

        const entries = Object.entries(node.children || {});

        if (!entries.length) return;

        const group = createGroup();

        for (const [name, child] of entries) {
            const item = document.createElement('span');

            item.className = child.type === 'dir'
                ? 'directory'
                : 'file';

            item.textContent = name + (child.type === 'dir' ? '/' : '');

            const wrapper = document.createElement('span');
            wrapper.style.marginRight = '24px';
            wrapper.appendChild(item);

            group.appendChild(wrapper);
        }
    },
    cd(args) {
        const path = resolvePath(args[0] || HOME);
        const node = getNode(path);

        if (!node) {
            print(`cd: ${args[0]}: no such directory`, 'red-text');
            return;
        }

        if (node.type !== 'dir') {
            print(`cd: ${args[0]}: not a directory`, 'red-text');
            return;
        }

        cwd = path;
        updatePrompt();
    },

    pwd() {
        print(cwd);
    },

    cat(args) {
        if (!args[0]) {
            print('cat: missing file operand', 'red-text');
            return;
        }

        const path = resolvePath(args[0]);
        const node = getNode(path);

        if (!node) {
            print(`cat: ${args[0]}: no such file or directory`, 'red-text');
            return;
        }

        if (node.type === 'dir') {
            print(`cat: ${args[0]}: is a directory`, 'red-text');
            return;
        }

        printContent(node.content);
    },

    whoami() {
        print('arozoid', 'green-text');
        print('aspiring game/systems developer');
    },

    echo(args) {
        print(getArguments(args));
    },

    history() {
        history.forEach((command, index) => {
            print(`${index + 1}  ${command}`);
        });
    },

    clear() {
        output.replaceChildren();
    }
};

// command execution

function execute(raw) {
    const trimmed = raw.trim();

    if (!trimmed) return;

    printPrompt(trimmed);

    const parts = trimmed.split(/\s+/);
    const command = parts.shift();
    const args = parts;

    if (Object.prototype.hasOwnProperty.call(commands, command)) {
        commands[command](args);
    } else {
        print(`${command}: command not found. try 'help'.`, 'red-text');
    }

    scrollToBottom();
}

// input handling

form.addEventListener('submit', event => {
    event.preventDefault();

    const raw = input.value;

    if (!raw.trim()) return;

    history.push(raw);
    historyIndex = history.length;

    execute(raw);

    input.value = '';
});

input.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            input.value = '';
        }
    }

    if (event.key === 'Tab') {
        event.preventDefault();
        autocomplete();
    }
});

// basic tab completion

function autocomplete() {
    const value = input.value;
    const commandLine = value.match(/^\s*(\S+)\s+(.*)$/);

    if (!commandLine) {
        const commandPrefix = value.trim();
        const matches = Object.keys(commands)
            .filter(command => command.startsWith(commandPrefix));
        const completion = commonPrefix(matches);

        if (completion.length > commandPrefix.length) {
            const leadingSpace = value.match(/^\s*/)[0];
            input.value = leadingSpace + completion + (matches.length === 1 ? ' ' : '');
        } else if (matches.length === 1) {
            input.value = value.trimStart() + ' ';
        }
        return;
    }

    const [, command, argumentsText] = commandLine;
    if (!['cd', 'ls', 'cat'].includes(command)) return;

    const token = argumentsText.match(/\S*$/)[0];
    const tokenStart = value.length - token.length;
    const slashIndex = token.lastIndexOf('/');
    const directoryPart = slashIndex < 0 ? '' : token.slice(0, slashIndex + 1);
    const namePrefix = slashIndex < 0 ? token : token.slice(slashIndex + 1);
    const directoryPath = directoryPart
        ? resolvePath(directoryPart)
        : cwd;
    const directory = getNode(directoryPath);

    if (!directory || directory.type !== 'dir') return;

    const matches = Object.entries(directory.children)
        .filter(([name]) => name.startsWith(namePrefix));
    const completion = commonPrefix(matches.map(([name]) => name));

    if (completion.length > namePrefix.length) {
        const suffix = matches.length === 1
            ? matches[0][1].type === 'dir' ? '/' : ' '
            : '';
        input.value = value.slice(0, tokenStart) + directoryPart + completion + suffix;
    } else if (matches.length === 1) {
        const [name, node] = matches[0];
        const suffix = node.type === 'dir' ? '/' : ' ';
        input.value = value.slice(0, tokenStart) + directoryPart + name + suffix;
    }
}

function commonPrefix(values) {
    if (!values.length) return '';

    let prefix = values[0];
    for (const value of values.slice(1)) {
        while (!value.startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
        }
    }
    return prefix;
}

// keep input focused when clicking terminal

document.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    input.focus();
});

input.focus();

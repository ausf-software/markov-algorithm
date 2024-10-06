function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class MarkovAlgorithm {
    constructor(initialState) {
        this.initialState = initialState;
        this.rules = [];
    }

    addRule(str) {
        try {
            if (!str || str.trim() === '') {
                throw new Error('Строка не должна быть пустой или состоять только из пробелов.');
            }
            this.rules.push(Rule.parse(str));
        } catch (error) {
            alert('Ошибка при добавлении правила: ' + error.message);
        }
    }

    execute(maxSteps) {
        let output = this.initialState;
        let intermediate = this.initialState;
        let ruleApplied;
        let steps = 0;

        do {
            let oldSteps = steps;
            ruleApplied = false;
            
            for (const rule of this.rules) {
                if (rule.getPattern() === '') {
                    output = rule.getReplacement() + output;
                    ruleApplied = true;
                    steps++;
                } else {
                    const pattern = new RegExp(escapeRegExp(rule.getPattern()));
                    if (pattern.test(output)) {
                        output = output.replace(pattern, rule.getReplacement());
                        ruleApplied = true;
                        steps++;
                    }
                }

                if (oldSteps !== steps) {
                    if (rule.isStopped()) {
                        ruleApplied = false;
                    }
                    break;
                }
            }
            intermediate = intermediate + "\n" + output;
            if (maxSteps === steps) break;
        } while (ruleApplied);

        return new Result(steps, output, intermediate);
    }
}

class Result {
    constructor(steps, res, intermediate) {
        this.steps = steps;
        this.res = res;
        this.intermediate = intermediate;
    }

    getIntermediate() {
        return this.intermediate;
    }

    getSteps() {
        return this.steps;
    }

    getRes() {
        return this.res;
    }
}

class MarkovProgramm {
    constructor(name, input, max_steps, rules) {
        this.name = name;
        this.max_steps = max_steps;
        this.input = input;
        this.rules = rules;
    }

    getMaxSteps() {
        return this.max_steps;
    }

    getName() {
        return this.name;
    }

    getInputString() {
        return this.input;
    }

    getRules() {
        return this.rules;
    }
}

class Rule {
    constructor(pattern, replacement, stopped) {
        this.pattern = pattern;
        this.replacement = replacement;
        this.stopped = stopped;
    }

    isStopped() {
        return this.stopped;
    }

    getPattern() {
        return this.pattern;
    }

    getReplacement() {
        return this.replacement;
    }

    static parse(str) {
        let parts;
        let stopped;

        if (str.includes('->')) {
            parts = str.split('->');
            stopped = false;
        } else if (str.includes('=>')) {
            parts = str.split('=>');
            stopped = true;
        } else {
            throw new Error("Неверный формат правила. Ожидается 'паттерн -> замена' или 'паттерн => замена'.");
        }

        if (parts.length !== 2) {
            throw new Error("Неверный формат правила. Ожидается два элемента: паттерн и замена.");
        }

        const pattern = parts[0].trim();
        const replacement = parts[1].trim();

        return new Rule(pattern, replacement, stopped);
    }
}

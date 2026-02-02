Quality assurance
=================
GlobaLeaks stands alone among whistleblowing software by maintaining rigorous software quality standards through a comprehensive Quality Assurance (QA) process, ensuring the platform remains unmatched in robustness, security, and overall quality.

.. include:: badges.rst

**Project Best Practices**

The best practices adopted within the project are publicly documented and peer-reviewed using the methodology defined by the Core Infrastructure Initiative (CII) Best Practices project. On top of this is adopted as well the OpenSSF Scorecard that evaluates various security practices such as vulnerability management, dependency updates, and code quality, ensuring the project meets industry standards.

For more details on the best practices adopted in this project, you can visit the project pages for the `CII Best Practices <https://bestpractices.coreinfrastructure.org/projects/3816>`_ and the `OpenSSF Scorecard <https://scorecard.dev/viewer/?uri=github.com/globaleaks/globaleaks-whistleblowing-software>`_.

**Code Review Process**

To ensure high code quality and maintain the integrity of the project, GlobaLeaks enforces mandatory code reviews for all its contributions. Code reviews play a key role in maintaining consistency, identifying potential issues early, and promoting best practices. Every submitted pull request undergoes peer review by the GlobaLeaks maintainers and community where the code is scrutinized for clarity, adherence to project guidelines, potential security vulnerabilities, and performance optimizations. Reviewers provide feedback and suggestions, and the author of the PR is responsible for addressing any concerns raised. Once feedback is incorporated, the code is re-reviewed by the maintainers, and upon approval, the PR is merged into the main codebase. This collaborative process helps catch issues before they are deployed, ensuring that only high-quality, well-tested code is integrated into the project.

For more details on this matter, you could check the `CONTRIBUTING <https://github.com/globaleaks/globaleaks-whistleblowing-software/blob/stable/CONTRIBUTING.md>`_ guidelines.

**Automated Testing and Code Coverage**

The development methodology incorporates a comprehensive suite of automated tests, including unit, integration, and end-to-end tests, to ensure the highest standards of correctness and prevent regressions. A strict requirement of at least 90% code coverage is enforced, ensuring that the vast majority of the codebase is thoroughly tested. Test execution is fully automated through Continuous Integration (CI), promptly identifying any untested or faulty code and preventing it from being merged into the main codebase.

For more details on test coverage, you can view the `Test Coverage on Codacy <https://app.codacy.com/gh/globaleaks/globaleaks-whistleblowing-software/dashboard>`_ and `Test Status on GitHub <https://github.com/globaleaks/globaleaks-whistleblowing-software/actions/workflows/tests.yml?query=branch%3Astable>`_.

**Code Quality Assurance**

Code quality is maintained through a combination of static code analysis, automated linters, and mandatory code reviews. Static analysis tools identify potential vulnerabilities, performance bottlenecks, and violations of best practices, while linters ensure code consistency and readability. Code reviews are required for all pull requests, helping maintain high standards and reducing the chance of introducing errors.

For more details on code quality, refer to the `Code Quality Dashboard on Codacy <https://app.codacy.com/gh/globaleaks/globaleaks-whistleblowing-software/dashboard>`_.

**Continuous Integration and Deployment**

Every commit and pull request is automatically tested using CI/CD pipelines, ensuring that faulty or untested code is not merged. Security scans and dependency checks are also automated as part of the CI process, helping identify potential security vulnerabilities or issues with third-party libraries. Before deployment, releases undergo pre-production testing to ensure stability.

You can view the `Build Status on GitHub <https://github.com/globaleaks/globaleaks-whistleblowing-software/actions/workflows/build.yml?query=branch%3Astable>`_.

**Performance and Security Testing**

The project undergoes load and stress testing to simulate real-world usage scenarios and ensure it can handle high traffic. Security best practices are enforced through regular security audits and penetration testing, identifying vulnerabilities before they can be exploited. This ensures the system is both performant and secure.

For further information, check the evaluations by `Probely Security Header <https://securityheaders.com/?q=https%3A%2F%2Fdemo.globaleaks.org%2F>`_, `MDN HTTP Observatory <https://developer.mozilla.org/en-US/observatory/analyze?host=demo.globaleaks.org>`_ and `Qualys SSL Labs <https://www.ssllabs.com/ssltest/analyze.html?d=demo.globaleaks.org>`_.

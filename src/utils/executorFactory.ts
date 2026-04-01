import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/PythonExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

function createExecutor(codeLanguage: string): CodeExecutorStrategy {
  if (codeLanguage === "PYTHON") {
    return new PythonExecutor();
  } else if (codeLanguage === "CPP") {
    return new CppExecutor();
  } else if (codeLanguage === "JAVA") {
    return new JavaExecutor();
  }
  throw new Error("Invalid language");
}

export default createExecutor;
